import { Star } from "lucide-react";
import { forwardRef } from "react";
import Button from "~/components/core/button";
import Heading from "~/components/core/heading";
import Paragraph from "~/components/core/paragraph";
import Section, { type SectionProps } from "~/components/section";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "~/components/core/tab";

interface ProductListProps extends SectionProps {
}

const ProductOverview = forwardRef<HTMLElement, ProductListProps>(({ ...props }, ref) => {
    return (
        <Section ref={ref}>
            <div className=" xl:gap-x-16 lg:gap-y-10 lg:gap-x-8 lg:grid-cols-7 lg:grid-rows-1 grid">
                {/* Image */}
                <div className=" lg:row-end-1 lg:col-span-4">
                    <img className="bg-gray-100 dark:bg-gray-800 rounded-lg w-full h-auto aspect-[4/3]" src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75" />
                </div>

                {/* Details */}
                <div className=" lg:max-w-none lg:mt-0 lg:col-span-3 lg:row-end-2 lg:row-span-2 sm:mt-16 max-w-2xl mt-14 mx-auto">
                    <div className="flex flex-col-reverse">
                        <div className="mt-4">
                            <Heading size="h3" className="">Application UI Icon Pack</Heading>
                            <Paragraph size="sm">Version 1.0 (Updated June 5, 2021)</Paragraph>
                        </div>
                        <div className=" flex items-center">
                            <Star className="size-6 fill-yellow-400 stroke-none" />
                            <Star className="size-6 fill-yellow-400 stroke-none" />
                            <Star className="size-6 fill-yellow-400 stroke-none" />
                            <Star className="size-6 fill-yellow-400 stroke-none" />
                            <Star className="size-6 fill-gray-300 stroke-none" />
                        </div>
                    </div>
                    <Paragraph className="mt-6">
                        The Application UI Icon Pack comes with over 200 icons in 3 styles: outline, filled, and branded. This playful icon pack is tailored for complex application user interfaces with a friendly and legible look.
                    </Paragraph>
                    <div className="grid sm:grid-cols-2 gap-x-8 grid-cols-1 mt-10">
                        <Button color='primary' size="lg">Add to Cart</Button>
                        <Button color="secundary" size="lg">Preview</Button>
                    </div>
                    <div className="mt-10 border-t dark:border-white/10 border-gray-900 pt-10">
                        <Heading size="h5">Highlights</Heading>
                        <Paragraph size="sm" className="my-4 pl-5">
                            <ul className="list-disc">
                                <li className="pl-2 not-last:mb-1">200+ SVG icons in 3 unique styles</li>
                                <li className="pl-2 not-last:mb-1">Compatible with Figma, Sketch, and Adobe XD</li>
                                <li className="pl-2 not-last:mb-1">Drawn on 24 x 24 pixel grid</li>
                            </ul>
                        </Paragraph>
                    </div>
                    <div className="mt-10 border-t dark:border-white/10 border-gray-900 pt-10">
                        <Heading size="h5">
                            License
                        </Heading>
                        <Paragraph size="sm" className="mt-4">
                            For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.
                        </Paragraph>
                    </div>
                    <div className="mt-10 border-t dark:border-white/10 border-gray-900 pt-10">
                        <Heading size="h5">Share</Heading>
                    </div>
                </div>

                {/* Tabs */}
                <div className=" lg:max-w-none w-full flex mt-16 lg:mt-0 lg:col-span-4 sm:mt-16 max-w-2xl  mx-auto">
                    <TabGroup className={'w-full'}>
                        <TabList >
                            <Tab >Customer Reviews</Tab>
                            <Tab >FAQ</Tab>
                            <Tab >Lisence</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel >
                                <div>

                                    {/* Review */}
                                    <div className="flex text-gray-500 group text-sm/5">
                                        <div className="py-10 mr-4">
                                            <div className="block size-10">
                                                <img src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80" className="rounded-full" />
                                            </div>
                                        </div>
                                        <div className="py-10 border-t group-first:border-transparent border-gray-900/10 dark:border-white/10">
                                            <Heading size="h5">
                                                Emily Selman
                                            </Heading>
                                            <Paragraph size="sm">
                                                <time dateTime="2021-07-16">July 16, 2021</time>
                                            </Paragraph>
                                            <div className="mt-4 flex items-center">
                                                <Star className="size-5 fill-yellow-400 stroke-none" />
                                                <Star className="size-5 fill-yellow-400 stroke-none" />
                                                <Star className="size-5 fill-yellow-400 stroke-none" />
                                                <Star className="size-5 fill-yellow-400 stroke-none" />
                                                <Star className="size-5 fill-gray-300 stroke-none" />
                                            </div>
                                            <div className="mt-4">
                                                <Paragraph size="sm">
                                                    This icon pack is just what I need for my latest project. There's an icon for just about anything I could ever need. Love the playful look!
                                                </Paragraph>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Review */}
                                    <div className="flex text-gray-500 group text-sm/5">
                                        <div className="py-10 mr-4">
                                            <div className="block size-10">
                                                <img src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80" className="rounded-full" />
                                            </div>
                                        </div>
                                        <div className="py-10 border-t group-first:border-transparent border-gray-900/10 dark:border-white/10">
                                            <Heading size="h5">
                                                Emily Selman
                                            </Heading>
                                            <Paragraph size="sm">
                                                <time dateTime="2021-07-16">July 16, 2021</time>
                                            </Paragraph>
                                            <div className="mt-4 flex items-center">
                                                <Star className="size-5 fill-yellow-400 stroke-none" />
                                                <Star className="size-5 fill-yellow-400 stroke-none" />
                                                <Star className="size-5 fill-yellow-400 stroke-none" />
                                                <Star className="size-5 fill-yellow-400 stroke-none" />
                                                <Star className="size-5 fill-gray-300 stroke-none" />
                                            </div>
                                            <div className="mt-4">
                                                <Paragraph size="sm">
                                                    This icon pack is just what I need for my latest project. There's an icon for just about anything I could ever need. Love the playful look!
                                                </Paragraph>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel className="pt-10" >
                                <div>
                                    <Heading size="h5">
                                        What format are these icons?
                                    </Heading>
                                    <Paragraph size="sm" className="mt-2">
                                        The icons are in SVG (Scalable Vector Graphic) format. They can be imported into your design tool of choice and used directly in code.
                                    </Paragraph>
                                </div>
                                <div className="mt-10">
                                    <Heading size="h5">
                                        What format are these icons?
                                    </Heading>
                                    <Paragraph size="sm" className="mt-2">
                                        The icons are in SVG (Scalable Vector Graphic) format. They can be imported into your design tool of choice and used directly in code.
                                    </Paragraph>
                                </div>
                                <div className="mt-10">
                                    <Heading size="h5">
                                        What format are these icons?
                                    </Heading>
                                    <Paragraph size="sm" className="mt-2">
                                        The icons are in SVG (Scalable Vector Graphic) format. They can be imported into your design tool of choice and used directly in code.
                                    </Paragraph>
                                </div>
                            </TabPanel>
                            <TabPanel className={'pt-10'}>
                                <div>
                                    <Heading size="h5">
                                        Overview
                                    </Heading>
                                    <Paragraph className="mt-2">
                                        For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.
                                    </Paragraph>
                                    <Paragraph size="sm" className="pl-5 my-4">
                                        <ul role="list" className="text-inherit list-disc">
                                            <li className="not-first-of-type:mt-1">You're allowed to use the icons in unlimited projects.</li>
                                            <li className="not-first-of-type:mt-1">You're allowed to use the icons in unlimited projects.</li>
                                        </ul>
                                    </Paragraph>
                                </div>
                                <div>
                                    <Heading size="h5" className="mt-5">
                                        What you can do with it
                                    </Heading>
                                    <Paragraph size="sm" className="pl-5 my-4">
                                        <ul role="list" className="text-inherit list-disc">
                                            <li className=" not-first-of-type:mt-1">Use them freely in your personal and professional work.</li>
                                            <li className=" not-first-of-type:mt-1">You're allowed to use the icons in unlimited projects.</li>
                                        </ul>
                                    </Paragraph>
                                </div>
                                <div>
                                    <Heading size="h5" className="mt-5">
                                        What you can't do with it
                                    </Heading>
                                    <Paragraph size="sm" className="pl-5 my-4">
                                        <ul role="list" className="text-inherit list-disc">
                                            <li className=" not-first-of-type:mt-1">Don't be greedy. Selling or distributing these icons in their original or modified state is prohibited.</li>
                                            <li className=" not-first-of-type:mt-1">You're allowed to use the icons in unlimited projects.</li>
                                        </ul>
                                    </Paragraph>
                                </div>
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </div>
            </div>
        </Section>
    )
})

export default ProductOverview;