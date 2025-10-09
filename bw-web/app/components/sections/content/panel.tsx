import { Input } from "@headlessui/react";
import { forwardRef } from "react";
import { Form } from "react-router";
import Panel from "~/components/core/panel";
import Heading from "~/components/core/heading";
import Paragraph from "~/components/core/paragraph";
import Section, { type SectionProps } from "~/components/core/section";
import Button from "~/components/core/button";

const ContentPanel = forwardRef<HTMLElement, SectionProps>((props, ref) => {
    return (
        <Section ref={ref} {...props}>
            <Panel color="gradient">
                <div className=" lg:gap-y-0 lg:items-center lg:grid-cols-2 lg:max-w-none lg:mx-0 sm:gap-y-20 gap-y-16 gap-x-8 grid-cols-1 max-w-2xl grid mx-auto">
                    <div>
                        <Heading size="h4">
                            Deploy faster
                        </Heading>
                        <Heading size="h1" className="mt-2">
                            Never pay for what you don't need
                        </Heading>
                        <Paragraph className="mt-6">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque,
                            iste dolor cupiditate blanditiis ratione.
                        </Paragraph>
                        <Paragraph className="mt-6">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque,
                            iste dolor cupiditate blanditiis ratione.
                        </Paragraph>
                        <Paragraph className="mt-6">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque,
                            iste dolor cupiditate blanditiis ratione.
                        </Paragraph>
                        <div className="mt-10 flex items-center gap-x-6">
                            <Button >Get Started</Button>
                            <a href="#" className="text-sm/6 font-semibold text-gray-900 dark:text-white">Learn more <span aria-hidden="true">→</span></a>
                        </div>
                    </div>
                    <div className="-mr-80">
                        <img className=" shadow-xl rounded-xl min-w-full max-w-xl relative w-auto h-auto aspect-auto z-10 ring-1 dark:ring-white/5" src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Fshowcases%2Fshowcase_6.png&w=3840&q=75"/>
                    </div>
                </div>
            </Panel>
        </Section>
    )
})

export default ContentPanel;