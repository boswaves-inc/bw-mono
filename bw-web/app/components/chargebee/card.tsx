import { createContext, createRef, useContext, useEffect, useRef, useState, type PropsWithChildren, type RefObject } from "react";
import type { CardApi, Component } from "./types";
import { useChargebee } from "./provider";
import { useTheme } from "~/hooks/theme";

const context = createContext<{ component: Component | null }>(null as any)

export const useCard = () => {
    const ref = createRef<CardApi>()

    return {
        ref,
        component: () => ref.current?.component()
    }
}

export const Card = ({ ref, children }: PropsWithChildren<{ ref?: RefObject<CardApi | null> }>) => {
    const { theme } = useTheme()
    const chargebee = useChargebee();

    const [component, setComponent] = useState<Component | null>(null)

    useEffect(() => {
        if (chargebee.instance) {
            const component = chargebee.instance.createComponent('card', {
                placeholder: {
                    number: "Number",
                    expiry: "Expiry",
                    cvv: "CVV",
                },
                style: {
                    // override styles for default state
                    base: {
                        color: theme == 'dark' ? '#fff' : '#101828',
                        fontSmoothing: 'antialiased',
                        ':focus': {
                            color: theme == 'dark' ? '#fff' : '#101828',
                        },
                        '::placeholder': {
                            color: '#6a7282',
                        },

                        ':focus::placeholder': {
                            color: '#6a7282',
                        },
                        ':-webkit-autofill': {
                            webkitTextColor: '#333',
                        }
                    },
                    invalid: {
                        color: '#e41029',
                        ':focus': {
                            color: '#e44d5f',
                        },
                        '::placeholder': {
                            color: '#FFCCA5',
                        },
                    }
                },
            })

            setComponent(component)
        }
    }, [chargebee.instance])

    useEffect(() => {
        if (ref && component) {
            ref.current = {
                component: () => component
                // tokenize: () => {
                //     return component.tokenize()
                // }
            }
        }
    }, [component])

    return (
        <context.Provider value={{ component }}>
            {children}
        </context.Provider>
    )
}

export const CardNumber = () => {
    const { component } = useContext(context)
    const ref = useRef<HTMLDivElement>(null)

    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(() => {
        if (component && ref.current) {
            const field = component.createField('number') as any

            field.on('ready', (e: any) => {
                setMounted(true)
            })

            field.mount(ref.current)

            return () => {
                field.destroy()
            }
        }
    }, [component, ref.current])

    return (
        <div data-loading={mounted == false} className="sm:text-sm/6 py-2 outline-gray-900/10 dark:outline-white/10 data-[loading=true]:bg-red-400 -outline-offset-1 outline-1 text-gray-900 dark:text-white select-none text-base/6 px-3 dark:bg-gray-800 bg-white rounded-md w-full">
            <div ref={ref} className="h-6 flex items-center text-inherit" />
        </div>
    )
}

export const CardExpiry = () => {
    const { component } = useContext(context)
    const ref = useRef<HTMLDivElement>(null)

    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(() => {
        if (component && ref.current) {
            const field = component.createField('expiry') as any

            field.on('ready', (e: any) => {
                setMounted(true)
            })

            field.mount(ref.current)

            return () => {
                field.destroy()
            }
        }
    }, [component, ref.current])

    return (
        <div data-loading={mounted == false} className="sm:text-sm/6 py-2 outline-gray-900/10 dark:outline-white/10 data-[loading=true]:bg-red-400 -outline-offset-1 outline-1 text-gray-900 dark:text-white select-none text-base/6 px-3 dark:bg-gray-800 bg-white rounded-md w-full">
            <div ref={ref} className="h-6 flex items-center text-inherit" />
        </div>
    )
}

export const CardCvv = () => {
    const { component } = useContext(context)
    const ref = useRef<HTMLDivElement>(null)

    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(() => {
        if (component && ref.current) {
            const field: any = component.createField('cvv') as any

            field.on('ready', (e: any) => {
                setMounted(true)
            })

            field.mount(ref.current)


            return () => {
                field.destroy()
            }
        }
    }, [component, ref.current])

    return (
        <div data-loading={mounted == false} className="sm:text-sm/6 py-2 outline-gray-900/10 dark:outline-white/10 data-[loading=true]:bg-red-400 -outline-offset-1 outline-1 text-gray-900 dark:text-white select-none text-base/6 px-3 dark:bg-gray-800 bg-white rounded-md w-full">
            <div ref={ref} className="h-6 flex items-center text-inherit" />
        </div>
    )
}