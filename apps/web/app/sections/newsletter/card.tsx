import { Input } from "@headlessui/react";
import { forwardRef, type ComponentProps } from "react";
import { Form } from "react-router";
import Panel from "~/components/core/panel";
import Heading from "~/components/core/heading";
import Paragraph from "~/components/core/paragraph";
import Section from "~/components/section";

export default ({ ...props }: ComponentProps<typeof Section>) => (
    <Section {...props}>
        <Panel color="gradient">
            <Heading size="h1" className="text-center max-w-3xl mx-auto">
                Get notified when we're launching
            </Heading>
            <Paragraph className="text-center max-w-lg mt-6 mx-auto">
                Reprehenderit ad esse et non officia in nulla. Id proident tempor incididunt nostrud nulla et culpa.
            </Paragraph>
            <Form className=" max-w-lg mx-auto mt-10 flex gap-x-4">
                <Input placeholder="Enter your email" className={'focus:outline-none ring-1 dark:ring-white/10 ring-gray-900/10 placeholder:text-gray-500 focus:ring-indigo-500 focus:ring-2 flex-auto dark:text-white text-gray-900 py-2 px-3.5 bg-white/5 rounded-md flex min-w-0 sm:text-sm/6 text-base/6'} />
                <button type="submit" className=" shadow-xs dark:text-gray-900 text-white bg-gray-900 z-10 dark:bg-white font-semibold text-sm/5 py-2.5 px-3.5 rounded-md flex-none">
                    Notify Me
                </button>
            </Form>
        </Panel>
    </Section>
)