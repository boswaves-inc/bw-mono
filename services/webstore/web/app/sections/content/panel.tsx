import { Input } from "@headlessui/react";
import { forwardRef, type ComponentProps } from "react";
import { Form } from "react-router";
import Panel from "~/components/core/panel";
import Paragraph from "~/components/core/paragraph";
import Section from "~/components/page";
import { Button } from "~/components/core/v2/button";
import { Heading } from "~/components/core/v2/typography";

export default ({ ...props }: ComponentProps<typeof Section>) => (
    <Section  {...props}>
        <Panel color="gradient">
            <div className=" lg:gap-y-0 lg:items-center lg:grid-cols-2 lg:max-w-none lg:mx-0 sm:gap-y-20 gap-y-16 gap-x-8 grid-cols-1 max-w-2xl grid mx-auto">
                <div>
                    <Heading size="h4">
                        Build Your Edge with Precision Tools
                    </Heading>
                    <Heading size="h1" className="mt-2">
                        Build your edge with BOSWaves
                    </Heading>
                    <Paragraph className="mt-6">
                        <strong className="dark:text-white">
                            1. Trend Indicators
                        </strong>
                        <br />
                        <span>
                            Pinpoint optimal entry and exit points with precision-driven signals designed to maximize trade efficiency.
                            Minimize guesswork and streamline decision-making with actionable, high-confidence alerts.
                            Engineered to adapt to your trading style, giving you a truly personalized edge.
                        </span>
                    </Paragraph>
                    <Paragraph className="mt-6">
                        <strong className="dark:text-white">
                            2. Oscillators
                        </strong>
                        <br />
                        <span>
                            Accurately measure momentum, trend strength, and market extremes to time your trades with confidence.
                            Seamlessly confirm signals from other tools for more reliable setups.
                            Sophisticated yet intuitive, these indicators integrate effortlessly into your custom toolbox.
                        </span>
                    </Paragraph>
                    <Paragraph className="mt-6">
                        <strong className="dark:text-white">
                            3. Smart Money Tools
                        </strong>
                        <br />
                        <span>
                            Track institutional flows, liquidity zones, and hidden market moves for high-probability setups.
                            Advanced analytics reveal opportunities beyond conventional indicators, giving you an insider perspective.
                            Designed for traders who want an edge that goes deeper than the standard market signals.
                        </span>
                    </Paragraph>
                    <div className="mt-10 flex items-center gap-x-6">
                        <Button >Get Started</Button>
                        <a href="#" className="text-sm/6 font-semibold text-gray-900 dark:text-white">Learn more <span aria-hidden="true">→</span></a>
                    </div>
                </div>
                <div className="-mr-80">
                    <img className=" shadow-xl rounded-xl min-w-full max-w-xl relative w-auto h-auto aspect-auto z-10 ring-1 dark:ring-white/5" src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Fshowcases%2Fshowcase_6.png&w=3840&q=75" />
                </div>
            </div>
        </Panel>
    </Section>
)