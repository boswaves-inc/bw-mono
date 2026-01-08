import { Column, Img, Link, Row, Section, Text } from '@react-email/components'
import { Fragment } from "react/jsx-runtime"
import { BlockArgs } from "./types"
import z from "zod/v4"

export const schema = z.object({
    ss: z.string()
})

export default () => {
    return (
        <Fragment>
            <Section>
                <Row className="mb-8 pl-2 pr-2">
                    <Column className="w-2/3">
                        <Img
                            src={`https://react-email-demo-8li1l9xfn-resend.vercel.app/static/slack-logo.png`}
                            width="120"
                            height="36"
                            alt="Slack"
                        />
                    </Column>
                    <Column align="right">
                        <Link href="/">
                            <Img
                                src={`https://react-email-demo-8li1l9xfn-resend.vercel.app/static/slack-facebook.png`}
                                width="32"
                                height="32"
                                alt="Slack"
                                className="inline ml-2"
                            />
                        </Link>
                        <Link href="/">
                            <Img
                                src={`https://react-email-demo-8li1l9xfn-resend.vercel.app/static/slack-facebook.png`}
                                width="32"
                                height="32"
                                alt="Slack"
                                className="inline ml-2"
                            />
                        </Link>
                        <Link href="/">
                            <Img
                                src={`https://react-email-demo-8li1l9xfn-resend.vercel.app/static/slack-facebook.png`}
                                width="32"
                                height="32"
                                alt="Slack"
                                className="inline ml-2"
                            />
                        </Link>
                    </Column>
                </Row>
            </Section>

            <Section>
                {/* <Link
                    className="text-[#b7b7b7] underline"
                    href="https://slackhq.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Our blog
                </Link>
                &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                <Link
                    className="text-[#b7b7b7] underline"
                    href="https://slack.com/legal"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Policies
                </Link>
                &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                <Link
                    className="text-[#b7b7b7] underline"
                    href="https://slack.com/help"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Help center
                </Link>
                &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                <Link
                    className="text-[#b7b7b7] underline"
                    href="https://slack.com/community"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-auth="NotApplicable"
                    data-linkindex="6"
                >
                    Slack Community
                </Link> */}
                <Text className="text-xs leading-3.75 text-left mb-12.5 text-[#b7b7b7]">
                    ©2022 Slack Technologies, LLC, a Salesforce company. <br />
                    500 Howard Street, San Francisco, CA 94105, USA <br />
                    <br />
                    All rights reserved.
                </Text>
            </Section>
        </Fragment>
    )
}

export const Footer = () => {
    return (
        <Fragment>
            <Section>
                <Row className="mb-8 pl-2 pr-2">
                    <Column className="w-2/3">
                        <Img
                            src={`https://react-email-demo-8li1l9xfn-resend.vercel.app/static/slack-logo.png`}
                            width="120"
                            height="36"
                            alt="Slack"
                        />
                    </Column>
                    <Column align="right">
                        <Link href="/">
                            <Img
                                src={`https://react-email-demo-8li1l9xfn-resend.vercel.app/static/slack-facebook.png`}
                                width="32"
                                height="32"
                                alt="Slack"
                                className="inline ml-2"
                            />
                        </Link>
                        <Link href="/">
                            <Img
                                src={`https://react-email-demo-8li1l9xfn-resend.vercel.app/static/slack-facebook.png`}
                                width="32"
                                height="32"
                                alt="Slack"
                                className="inline ml-2"
                            />
                        </Link>
                        <Link href="/">
                            <Img
                                src={`https://react-email-demo-8li1l9xfn-resend.vercel.app/static/slack-facebook.png`}
                                width="32"
                                height="32"
                                alt="Slack"
                                className="inline ml-2"
                            />
                        </Link>
                    </Column>
                </Row>
            </Section>

            <Section>
                {/* <Link
                    className="text-[#b7b7b7] underline"
                    href="https://slackhq.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Our blog
                </Link>
                &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                <Link
                    className="text-[#b7b7b7] underline"
                    href="https://slack.com/legal"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Policies
                </Link>
                &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                <Link
                    className="text-[#b7b7b7] underline"
                    href="https://slack.com/help"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Help center
                </Link>
                &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                <Link
                    className="text-[#b7b7b7] underline"
                    href="https://slack.com/community"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-auth="NotApplicable"
                    data-linkindex="6"
                >
                    Slack Community
                </Link> */}
                <Text className="text-xs leading-3.75 text-left mb-12.5 text-[#b7b7b7]">
                    ©2022 Slack Technologies, LLC, a Salesforce company. <br />
                    500 Howard Street, San Francisco, CA 94105, USA <br />
                    <br />
                    All rights reserved.
                </Text>
            </Section>
        </Fragment>
    )
}