import { forwardRef, type ComponentProps } from "react";
import { Link } from "react-router";
import Heading from "~/components/core/heading";
import Paragraph from "~/components/core/paragraph";
import { ButtonV2 } from "~/components/core/v2/button";

export default ({ ...props }: ComponentProps<'section'>) => {
    return (
        <section {...props}>
            <div className="relative isolate">
                <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"></div>
                </div>
                <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                    <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"></div>
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center max-w-2xl  mx-auto">
                        <Heading size="title" className="mt-8">Build your toolbox.</Heading>
                        <Paragraph size="xl" className="mt-8 text-pretty">
                            BOSWaves redefines what a trading toolkit should be - customizable, efficient, and built entirely around your needs. Your toolbox, your strategy, your terms.
                        </Paragraph>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <ButtonV2 size="lg" asChild >
                                <Link to={'#'}>
                                    Get Started
                                </Link>
                            </ButtonV2>
                            <ButtonV2 size="lg" variant="link" className="text-foreground" asChild>
                                <Link to={'#'}>
                                    Learn more
                                </Link>
                            </ButtonV2>
                        </div>
                    </div>
                    <img className="h-auto max-w-full mt-16 sm:mt-24 rounded-md shadow-2xl ring-1 dark:ring-white/5 ring-gray-900/5" src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75" />
                </div>
            </div>
        </section>
    )
}
