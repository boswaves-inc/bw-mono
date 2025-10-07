import { forwardRef } from "react";
import Button from "~/components/core/button";
import Heading from "~/components/core/heading";
import Paragraph from "~/components/core/paragraph";

const HeroCentered = forwardRef<HTMLElement>((props, ref) => {
    return (
        <section ref={ref}>
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div aria-hidden="true" className="absolute  inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"></div>
                </div>
                <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                    <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"></div>
                </div>
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 dark:text-gray-400 ring-1 dark:ring-white/10 ring-gray-900/10 dark:hover:ring-white/20 hover:ring-gray-900/20">
                            Announcing our next round of funding.
                            <a href="#" className="font-semibold dark:text-indigo-400 text-indigo-600">
                                <span aria-hidden="true" className="absolute inset-0">
                                </span>
                                Read more
                                <span aria-hidden="true">
                                    &rarr;
                                </span>
                            </a>
                        </div>
                    </div>
                    <div className="text-center max-w-2xl  mx-auto">
                        <Heading size="title">
                            Data to enrich your online business
                        </Heading>
                        <Paragraph size="xl" className="mt-8 text-pretty">
                            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
                        </Paragraph>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Button color="primary">
                                Get Started
                            </Button>
                            <a href="#" className="text-sm/6 font-semibold text-gray-900 dark:text-white">Learn more <span aria-hidden="true">→</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
})

export default HeroCentered;