import { CloudUpload, Hammer, LucidePackageOpen } from "lucide-react";
import { forwardRef } from "react";
import Button from "~/components/core/button";
import Heading from "~/components/core/heading";
import Paragraph from "~/components/core/paragraph";
import Section from "~/components/core/section";

const ContentTiles = forwardRef<HTMLElement>((props, ref) => {
    return (
        <Section ref={ref} {...props}>
            <div className="max-w-4xl">
                <Heading size="h4">Deploy faster</Heading>
                <Heading size="h1" className="mt-2">
                    Never pay for what you don't use
                </Heading>
                <Paragraph size="lg" className="mt-6">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque,
                    iste dolor cupiditate blanditiis ratione.
                </Paragraph>
            </div>
            <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 lg:grid-flow-col lg:gap-x-8 lg:gap-y-16">
                <div className="lg:pr-8">
                    <Heading size="h3">How it works</Heading>
                    <Paragraph className="mt-6">
                        Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque erat velit. Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae sed turpis id.
                    </Paragraph>
                    <ul className="text-gray-500 dark:text-gray-400 max-w-xl mt-8 list-none">
                        <li className="gap-x-3 flex not-last:my-8">
                            <CloudUpload className="size-5 shrink-0 dark:text-indigo-400 text-indigo-500" />
                            <span>
                                <strong className="font-semibold dark:text-white text-gray-900">
                                    1. Connect your TradingView
                                </strong>
                                {" Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione."}
                            </span>
                        </li>
                        <li className="gap-x-3 flex not-last:my-8">
                            <Hammer className="size-5 shrink-0 dark:text-indigo-400 text-indigo-500" />
                            <span>
                                <strong className="font-semibold dark:text-white text-gray-900">
                                    2. Select your indicators
                                </strong>
                                {" Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione."}
                            </span>
                        </li>
                        <li className="gap-x-3 flex not-last:my-8">
                            <CloudUpload className="size-5 shrink-0 dark:text-indigo-400 text-indigo-500" />
                            <span>
                                <strong className="font-semibold dark:text-white text-gray-900">
                                    3. Improve your trades with BosWaves
                                </strong>
                                {" Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione."}
                            </span>
                        </li>
                    </ul>

                    {/* Optional */}
                    <div className="mt-10 flex items-center  gap-x-6">
                        <Button >Get Started</Button>
                        <a href="#" className="text-sm/6 font-semibold text-gray-900 dark:text-white">Learn more <span aria-hidden="true">→</span></a>
                    </div>
                </div>
                <div className=" lg:-mr-16  lg:col-span-2 pt-16">
                    <div className="xl:gap-8 lg:grid-cols-2 lg:mx-0 z-10 sm:grid-cols-4 sm:-mr-16 gap-4 grid-cols-2 grid -mx-8">
                        <div className="outline-transparent -outline-offset-1 outline-1 shadow-xl rounded-xl overflow-hidden aspect-square">
                            <img className=" w-full h-full object-cover aspect-square" src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Fshowcases%2Fshowcase_6.png&w=3840&q=75" />
                        </div>
                        <div className="outline-transparent -outline-offset-1 even:-mt-8 even:lg:-mt-40 outline-1 shadow-xl rounded-xl overflow-hidden aspect-square">
                            <img className=" w-full h-full object-cover aspect-square" src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Fshowcases%2Fshowcase_6.png&w=3840&q=75" />
                        </div>
                        <div className="outline-transparent -outline-offset-1 even:-mt-8 even:lg:-mt-40 outline-1 shadow-xl rounded-xl overflow-hidden aspect-square">
                            <img className=" w-full h-full object-cover aspect-square" src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Fshowcases%2Fshowcase_6.png&w=3840&q=75" />
                        </div>
                        <div className="outline-transparent -outline-offset-1 even:-mt-8 even:lg:-mt-40 outline-1 shadow-xl rounded-xl overflow-hidden aspect-square">
                            <img className=" w-full h-full object-cover aspect-square" src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Fshowcases%2Fshowcase_6.png&w=3840&q=75" />
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    )
})

export default ContentTiles;