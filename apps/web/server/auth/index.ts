import { addDays, addMinutes, isPast, milliseconds, millisecondsToSeconds as seconds } from "date-fns"
import { crypt, gen_salt, increment } from "@boswaves/core/utils/drizzle"
import { Email, User, UserCredentials } from "@boswaves/core"
import { Session } from "@boswaves/core/schema/auth/session"
import { and, eq, gt, isNull, ne } from "drizzle-orm"
import { recoverSession, authSession } from "./cookies"
import { getSession } from "~/utils/session"
import { data, redirect } from "react-router"
import { UserOtp } from "@boswaves/core/schema/auth/user"

import type Chargebee from "chargebee"
import type { Jwt } from "@boswaves/core/jwt"
import type { Postgres } from "@boswaves/core/postgres"
import type { AuthOptions, AuthRedirect, AuthToken, ResetToken } from "./types"
import type { Smtp } from "@boswaves-inc/smtp-sdk"

export class Auth {
    private _chargebee: Chargebee;
    private _postgres: Postgres;
    private _smtp: Smtp;
    private _jwt: Jwt;

    constructor({ chargebee, postgres, smtp, jwt }: AuthOptions) {
        this._chargebee = chargebee;
        this._postgres = postgres;
        this._smtp = smtp;
        this._jwt = jwt;
    }

    public async authenticate(request: Request): Promise<User | null>;
    public async authenticate<T extends Partial<AuthRedirect>>(request: Request, params: T): Promise<T['onSuccess'] extends string ? null : (User | null)>;
    public async authenticate<T extends Partial<AuthRedirect>>(request: Request, { onFailure, onVerify, onSuccess }: T = {} as T): Promise<User | null> {
        const session = await getSession(request, authSession)
        const token = await this._auth_token(request)

        // Check if we have a token stored in the cookie and has not expired yet
        if (token != undefined) {
            if (isPast(milliseconds({ seconds: token.exp }))) {
                if (onFailure != undefined) {
                    throw redirect(onFailure, {
                        headers: [
                            ['Set-Cookie', await authSession.destroySession(session)]
                        ]
                    })
                }

                throw new Error('token expired')
            }

            //  Process and return the user record
            const user = await this._postgres.transaction(async tx => {

                // Get user status from token uid
                const user = await tx.query.User.findFirst({
                    where: eq(User.uid, token.sub),
                })

                // Ensure user exists and is not deleted
                if (!user || user.status === 'deleted') {
                    return null;
                }

                // Refresh the current token if it's past halfway of it's lifetime
                if ((token.exp - seconds(Date.now())) / (token.exp - token.iat) <= 0.5) {

                    // Update the session record
                    const state = await tx.update(Session).set({
                        nonce: increment(Session.nonce),
                        updated_at: new Date(),
                        expired_at: addDays(Date.now(), 90),
                    }).where(and(
                        eq(Session.id, token.jti),
                        eq(Session.nonce, token.nonce),
                        gt(Session.expired_at, new Date()),
                        isNull(Session.revoked_at),
                    )).returning().then(x => x.at(0))


                    // Update the cookie token
                    if (state == undefined) {

                        // Token is set but cannot be refreshed,
                        if (onFailure != undefined) {
                            session.unset('token')

                            throw redirect(onFailure, {
                                headers: [
                                    ['Set-Cookie', await authSession.commitSession(session)]
                                ]
                            })
                        }

                        // onFailure is not set, throw error
                        throw new Error('invalid token nonce');

                    }
                    else {
                        const updated = await this._jwt.sign({ nonce: state.nonce }, {
                            exp: seconds(state.expired_at.valueOf()),
                            iat: seconds(state.updated_at.valueOf()),
                            sub: token.sub,
                            jti: token.jti
                        })

                        session.set('token', updated)
                    }
                }

                return user
            })

            // If user is pending, redirect to onVerify
            if (user?.status === 'pending') {
                if (onVerify != undefined) {
                    throw redirect(onVerify, {
                        headers: [
                            ['Set-Cookie', await authSession.commitSession(session)]
                        ]
                    })
                }

                // onVerify is not set, assume require verification is expected
                return null
            }

            // If user is active, redirect back to index
            if (user?.status === 'active') {
                if (onSuccess != undefined) {
                    throw redirect(onSuccess, {
                        headers: [
                            ['Set-Cookie', await authSession.commitSession(session)]
                        ]
                    })
                }

                // onSuccess is not set, assume success is expected
                return user
            }
        }

        // Token is not set so we're not authenticated,
        if (onFailure != undefined) {
            throw redirect(onFailure, {
                headers: [
                    ['Set-Cookie', await authSession.destroySession(session)]
                ]
            })
        }

        // onFailure is not set, assume failure is expected
        return null
    }

    public async login(request: Request, email: string, password: string, { onVerify, onSuccess }: Pick<AuthRedirect, 'onVerify' | 'onSuccess'>) {
        const session = await getSession(request, authSession)
        const token = await this._postgres.transaction(async tx => {
            // Load user with given credentials
            const user = await tx.select({
                uid: User.uid,
                status: User.status
            })
                .from(User)
                .innerJoin(UserCredentials,
                    eq(User.uid, UserCredentials.uid)
                ).where(and(
                    ne(User.status, 'deleted'),
                    eq(User.email, email),
                    eq(UserCredentials.password, crypt(password, UserCredentials.password))
                )).then(x => x.at(0))

            // Check if user with credentials exists
            if (user == undefined) {
                throw new Error('invalid credentials')
            }

            if (user.status != 'active') {
                throw redirect(onVerify, {
                    headers: [
                        ['Set-Cookie', await authSession.commitSession(session)]
                    ]
                })
            }

            // Inser the user session into the database
            const [{ id, nonce, expired_at, created_at }] = await tx.insert(Session).values({
                uid: user.uid,
                expired_at: addDays(Date.now(), 90),
            }).returning()

            // Store the session in a signed jwt
            const token = await this._jwt.sign({ nonce }, {
                exp: seconds(expired_at.valueOf()),
                iat: seconds(created_at.valueOf()),
                sub: user.uid,
                jti: id
            })

            return token
        })


        session.set('token', token)

        // on success
        return redirect(onSuccess, {
            headers: [
                ['Set-Cookie', await authSession.commitSession(session)]
            ]
        })
    }

    public async signup(request: Request, email: string, first_name: string, last_name: string, password: string, { onSuccess }: Pick<AuthRedirect, 'onSuccess'>) {
        const session = await getSession(request, authSession)

        const token = await this._postgres.transaction(async tx => {
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            // Insert the base user profile
            const [{ uid }] = await tx.insert(User).values({
                first_name,
                last_name,
                email,
            }).returning().catch(x => {
                throw new Error('user with email already exists')
            })

            // Insert the initial user session
            const [{ id, nonce, expired_at, created_at }] = await tx.insert(Session).values({
                uid,
                expired_at: addDays(Date.now(), 90),
            }).returning()

            // Insert the user credentials
            await tx.insert(UserCredentials).values({
                uid,
                password: crypt(password, gen_salt('bf'))
            })

            // Create a new OTP to verify the account
            await tx.insert(UserOtp).values({
                uid,
                hash: crypt(code, gen_salt('bf')),
                scope: 'verify_account',
                expires_at: addMinutes(Date.now(), 10)
            }).returning()



            // Queue the OTP email to be sent
            await this._smtp.send()

            await tx.insert(Email).values({
                recipient: email,
                sender: '"Maddison Foo Koch" <maddison53@ethereal.email>',
                subject: "Hello ✔",
            })

            // Create the user in the chargebee backend
            await this._chargebee.customer.create({
                id: uid,
                email,
                last_name,
                first_name,
            });

            // TODO remove this line
            console.log(`'${code}'`)

            // Sign the session as a JWT token and return the result
            return await this._jwt.sign({ nonce }, {
                exp: seconds(expired_at.valueOf()),
                iat: seconds(created_at.valueOf()),
                sub: uid,
                jti: id
            })
        });

        session.set('token', token)

        return redirect(onSuccess, {
            headers: [
                ['Set-Cookie', await authSession.commitSession(session)]
            ]
        })
    }

    public async recover(request: Request, email: string, { onSuccess }: Pick<AuthRedirect, 'onSuccess'>) {
        const session = await getSession(request, recoverSession)
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await this._postgres.transaction(async tx => {
            const user = await tx.query.User.findFirst({
                where: and(
                    eq(User.email, email.trim()),
                    ne(User.status, 'deleted')
                ),
            })

            if (user == undefined) {
                throw new Error('user with email does not exist')
            }

            await tx.update(UserOtp).set({
                revoked_at: new Date()
            }).where(and(
                eq(UserOtp.uid, user.uid),
                isNull(UserOtp.revoked_at),
                isNull(UserOtp.consumed_at),
                eq(UserOtp.scope, 'recover_account'),
            ))
            // Create a new OTP to reset the account
            const [otp] = await tx.insert(UserOtp).values({
                uid: user.uid,
                hash: crypt(code, gen_salt('bf')),
                scope: 'recover_account',
                expires_at: addMinutes(Date.now(), 10)
            }).returning()

            const token = await this._jwt.sign({ cc: false }, {
                sub: user.uid,
                jti: otp.id,
                exp: seconds(otp.expires_at.valueOf()),
                iat: seconds(otp.created_at.valueOf())
            })

            session.set('token', token)

            await this._smtp.send()

            // Queue the OTP email to be sent
            await tx.insert(Email).values({
                recipient: email,
                template: null,
                sender: '"Maddison Foo Koch" <maddison53@ethereal.email>',
                subject: "Hello ✔",
            })
        });

        return redirect(onSuccess, {
            headers: [
                ['Set-Cookie', await recoverSession.commitSession(session)]
            ]
        })
    }

    public async recover_resend(request: Request, { onFailure }: Pick<AuthRedirect, 'onFailure'>) {
        const session = await getSession(request, recoverSession)
        const token = await this._reset_token(request, { onFailure })

        // Generate a new OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await this._postgres.transaction(async tx => {

            // Revoke all recover_account OTP's for this user
            await tx.update(UserOtp).set({
                revoked_at: new Date()
            }).where(and(
                eq(UserOtp.uid, token.sub),
                isNull(UserOtp.revoked_at),
                isNull(UserOtp.consumed_at),
                eq(UserOtp.scope, 'recover_account'),
            ))

            // Check if the user has not been deleted in the mean time
            const user = await tx.query.User.findFirst({
                where: and(
                    eq(User.uid, token.sub),
                    ne(User.status, 'deleted')
                ),
            })

            // If user has been deleted, perform onFailure redirect
            if (user == undefined) {
                return redirect(onFailure, {
                    headers: [
                        ['Set-Cookie', await recoverSession.destroySession(session)]
                    ]
                })
            }

            // Create a new OTP to reset the account
            const [otp] = await tx.insert(UserOtp).values({
                uid: user.uid,
                hash: crypt(code, gen_salt('bf')),
                scope: 'recover_account',
                expires_at: addMinutes(Date.now(), 10)
            }).returning()

            // Sign the new updated reset token
            const updated = await this._jwt.sign({ cc: false }, {
                sub: user.uid,
                jti: otp.id,
                exp: seconds(otp.expires_at.valueOf()),
                iat: seconds(otp.created_at.valueOf())
            })

            // Apply the newly signed token to the session cookie
            session.set('token', updated)

            await this._smtp.send()

            // Queue the OTP email to be sent
            await tx.insert(Email).values({
                recipient: user.email,
                template: null,
                sender: '"Maddison Foo Koch" <maddison53@ethereal.email>',
                subject: "Hello ✔",
            })
        });

        return data({ success: true }, {
            headers: [
                ['Set-Cookie', await recoverSession.commitSession(session)]
            ]
        })
    }

    public async recover_confirm(request: Request, code: string, { onSuccess, onFailure }: Pick<AuthRedirect, 'onSuccess' | 'onFailure'>) {
        const session = await getSession(request, recoverSession)
        const token = await this._reset_token(request, { onFailure })

        await this._postgres.transaction(async tx => {
            // check otp and then generate a short lived reset token
            const otp = await tx.select().from(UserOtp).where(and(
                eq(UserOtp.uid, token.sub),
                eq(UserOtp.scope, 'recover_account'),
                eq(UserOtp.hash, crypt(code, UserOtp.hash)),
                isNull(UserOtp.consumed_at)
            )).then(x => x.at(0))

            // Check if the code is valid an not expired
            if (otp !== undefined && otp.expires_at <= new Date()) {
                throw new Error('code expired')
            }
            else if (otp == undefined) {
                throw new Error('code invalid')
            }

            // Set the CC flag of the reset token to true
            const updated = await this._jwt.sign({ cc: true }, {
                sub: token.sub,
                jti: token.jti,
                exp: seconds(otp.expires_at.valueOf()),
                iat: seconds(otp.created_at.valueOf())
            })

            // Apply the updated token to the session cookie
            session.set('token', updated)
        })

        return redirect(onSuccess, {
            headers: [
                ['Set-Cookie', await recoverSession.destroySession(session)]
            ]
        })
    }

    public async recover_reset(request: Request, password: string, { onSuccess, onFailure, onVerify }: AuthRedirect) {
        const session = await getSession(request, recoverSession)
        const token = await this._reset_token(request, { onFailure })

        if (token.cc === false) {
            throw redirect(onFailure, {
                headers: [
                    ['Set-Cookie', await recoverSession.destroySession(session)]
                ]
            })
        }

        const { status } = await this._postgres.transaction(async tx => {
            // Check if the user has been deleted in the mean time
            const user = await tx.query.User.findFirst({
                where: and(
                    eq(User.uid, token.sub),
                    ne(User.status, 'deleted')
                ),
            })

            // If user has been deleted, perform onFailure redirect
            if (user == undefined) {
                throw redirect(onFailure, {
                    headers: [
                        ['Set-Cookie', await recoverSession.destroySession(session)]
                    ]
                })
            }

            // Attempt to consume the OTP
            const otp = await tx.update(UserOtp).set({
                attempts: increment(UserOtp.attempts),
                consumed_at: new Date(),
            }).where(and(
                eq(UserOtp.id, token.jti),
                eq(UserOtp.uid, token.sub),
                eq(UserOtp.scope, 'recover_account'),
                isNull(UserOtp.consumed_at),
            )).returning().then(x => x.at(0))

            // Check if the code is valid an not expired
            if (otp == undefined || otp.expires_at <= new Date()) {
                throw redirect(onFailure, {
                    headers: [
                        ['Set-Cookie', await recoverSession.destroySession(session)]
                    ]
                })
            }

            // Update the user credentials
            await tx.update(UserCredentials).set({
                password: crypt(password, gen_salt('bf'))
            }).where(eq(UserCredentials.uid, token.sub))

            // Insert the initial user session
            const [{ id, nonce, expired_at, created_at }] = await tx.insert(Session).values({
                uid: user.uid,
                expired_at: addDays(Date.now(), 90),
            }).returning()

            // Sign the session as a JWT token and return the result
            const updated = await this._jwt.sign({ nonce }, {
                exp: seconds(expired_at.valueOf()),
                iat: seconds(created_at.valueOf()),
                sub: user.uid,
                jti: id
            })

            session.set('token', updated)

            return user
        })

        if (status === 'pending') {
            return redirect(onVerify, {
                headers: [
                    ['Set-Cookie', await authSession.commitSession(session)]
                ]
            })
        }

        return redirect(onSuccess, {
            headers: [
                ['Set-Cookie', await authSession.commitSession(session)]
            ]
        })
    }

    public async verify_resend(request: Request, { onFailure }: Pick<AuthRedirect, 'onFailure'>) {
        const session = await getSession(request, authSession)
        const token = await this._auth_token(request)

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Check if we are currently authenticated
        if (token == undefined) {
            return redirect(onFailure, {
                headers: [
                    ['Set-Cookie', await authSession.destroySession(session)]
                ]
            })
        }

        await this._postgres.transaction(async tx => {
            await tx.update(UserOtp).set({
                revoked_at: new Date()
            }).where(and(
                eq(UserOtp.uid, token.sub),
                isNull(UserOtp.consumed_at),
                isNull(UserOtp.revoked_at),
                eq(UserOtp.scope, 'verify_account'),
            )).returning()

            await tx.insert(UserOtp).values({
                uid: token.sub,
                hash: crypt(code, gen_salt('bf')),
                scope: 'verify_account',
                expires_at: new Date(Date.now() + 10 * 60 * 1e3),
            }).returning()

            await this._smtp.send()

            // Queue OTP to be sent
            await tx.insert(Email).values({
                recipient: "seaszn.libertas@gmail.com",
                sender: '"Maddison Foo Koch" <maddison53@ethereal.email>',
                subject: "Hello ✔",
            })
        });

        return data({ success: true })
    }

    public async verify_confirm(request: Request, code: string, { onSuccess, onFailure }: Pick<AuthRedirect, 'onSuccess' | 'onFailure'>) {
        const token = await this._auth_token(request, { onFailure })

        await this._postgres.transaction(async tx => {
            await tx.update(User).set({
                status: 'active'
            }).where(and(
                eq(User.uid, token.sub),
                eq(User.status, 'pending')
            ))

            const otp = await tx.update(UserOtp).set({
                attempts: increment(UserOtp.attempts),
                consumed_at: new Date(),
            }).where(and(
                eq(UserOtp.uid, token.sub),
                eq(UserOtp.scope, 'verify_account'),
                eq(UserOtp.hash, crypt(code, UserOtp.hash)),
                isNull(UserOtp.consumed_at),
            )).returning().then(x => x.at(0))

            // Check if the code is valid an not expired
            if (otp !== undefined && otp.expires_at <= new Date()) {
                throw new Error('code expired')
            }
            else if (otp == undefined) {
                throw new Error('code invalid')
            }
        })

        return redirect(onSuccess)
    }

    private async _auth_token(request: Request): Promise<AuthToken | null>;
    private async _auth_token(request: Request, { onFailure }: Partial<Pick<AuthRedirect, 'onFailure'>>): Promise<AuthToken>;
    private async _auth_token(request: Request, { onFailure }: Partial<Pick<AuthRedirect, 'onFailure'>> = {}) {
        const session = await getSession(request, authSession)
        const token = session.get('token')

        if (token == undefined) {
            if (onFailure != undefined) {
                throw redirect(onFailure, {
                    headers: [
                        ['Set-Cookie', await authSession.destroySession(session)]
                    ]
                })
            }

            return null
        }

        const { payload } = await this._jwt.verify<{ nonce: number }>(token)
        const { nonce, sub, iat, exp, jti } = payload as AuthToken

        if (isPast(milliseconds({ seconds: exp }))) {
            if (onFailure != undefined) {
                throw redirect(onFailure, {
                    headers: [
                        ['Set-Cookie', await authSession.destroySession(session)]
                    ]
                })
            }

            throw new Error('token expired')
        }

        return { nonce, sub, iat, exp, jti } satisfies AuthToken
    }

    private async _reset_token(request: Request): Promise<ResetToken | null>;
    private async _reset_token(request: Request, { onFailure }: Partial<Pick<AuthRedirect, 'onFailure'>>): Promise<ResetToken>;
    private async _reset_token(request: Request, { onFailure }: Partial<Pick<AuthRedirect, 'onFailure'>> = {}) {
        const session = await getSession(request, recoverSession)
        const token = session.get('token')

        if (token == undefined) {
            if (onFailure != undefined) {
                throw redirect(onFailure, {
                    headers: [
                        ['Set-Cookie', await recoverSession.destroySession(session)]
                    ]
                })
            }

            return null
        }

        const { payload } = await this._jwt.verify<ResetToken>(token)
        const { sub, iat, exp, jti, cc } = payload

        if (isPast(milliseconds({ seconds: exp }))) {
            if (onFailure != undefined) {
                throw redirect(onFailure, {
                    headers: [
                        ['Set-Cookie', await recoverSession.destroySession(session)]
                    ]
                })
            }

            throw new Error('token expired')
        }

        return { sub, iat, exp, jti, cc } satisfies ResetToken
    }
}