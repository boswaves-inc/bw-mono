import type { Route } from "./+types/products.$id";
import { DivideCircle, Star } from "lucide-react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Button from "~/components/core/button";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function renderer() {
  return (
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl sm:py-24 py-16 mx-auto">
        <div className=" xl:gap-x-16 lg:gap-y-10 lg:gap-x-8 lg:grid-cols-7 lg:grid-rows-1 grid">
          <div className=" lg:row-end-1 lg:col-span-4">
            <div className="bg-gray-100 rounded-lg w-full h-auto aspect-[4/3]" />
          </div>
          <div className=" lg:max-w-none lg:mt-0 lg:col-span-3 lg:row-end-2 lg:row-span-2 sm:mt-16 max-w-2xl mt-14 mx-auto">
            <div className="flex flex-col-reverse">
              <div className="mt-4">
                <h1 className="sm:text-3xl text-gray-900 tracking-tight font-bold text-2xl">Application UI Icon Pack</h1>
                <p className=" text-gray-500 mt-2 text-sm">Version 1.0 (Updated June 5, 2021)</p>
              </div>
              <div className=" flex items-center">
                <Star className="size-6 fill-yellow-400 stroke-none" />
                <Star className="size-6 fill-yellow-400 stroke-none" />
                <Star className="size-6 fill-yellow-400 stroke-none" />
                <Star className="size-6 fill-yellow-400 stroke-none" />
                <Star className="size-6 fill-gray-300 stroke-none" />
              </div>
            </div>
            <p className="text-gray-500 mt-6">
              The Application UI Icon Pack comes with over 200 icons in 3 styles: outline, filled, and branded. This playful icon pack is tailored for complex application user interfaces with a friendly and legible look.
            </p>
            <div className="grid sm:grid-cols-2 gap-x-8 grid-cols-1 mt-10">
              <Button color='primary' size="lg">Add to Cart</Button>
              {/* <button className=" text-white font-medium text-base py-3 px-8 bg-blue-600 rounded-md justify-center w-full items-center focus:ring-2 focus:ring-offset-2 focus:ring-offset-current focus:ring-blue-600">
                Add To Cart
              </button> */}
              <Button color="secundary" size="lg">Preview</Button>
              {/* <button className="font-medium text-base py-3 px-8 bg-blue-50 text-blue-700 rounded-md justify-center w-full items-center focus:ring-2 ring-offset-2 ring-offset-white ring-blue-600">
                Preview
              </button> */}
            </div>
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h3 className="text-gray-900 font-medium text-sm/5">Highlights</h3>
              <div className="mt-4">
                <ul className="text-gray-500 text-sm/5 pl-5 list-disc">
                  <li className="pl-2 not-last:mb-1">200+ SVG icons in 3 unique styles</li>
                  <li className="pl-2 not-last:mb-1">Compatible with Figma, Sketch, and Adobe XD</li>
                  <li className="pl-2 not-last:mb-1">Drawn on 24 x 24 pixel grid</li>
                </ul>
              </div>
            </div>
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h3 className="text-gray-900 font-medium text-sm/5">License</h3>
              <p className="mt-4 text-gray-500 text-sm/5">
                For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.
              </p>
            </div>
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h3 className="text-gray-900 font-medium text-sm/5">Share</h3>
            </div>
          </div>
          <div className=" lg:max-w-none w-full flex mt-16 lg:mt-0 lg:col-span-4 sm:mt-16 max-w-2xl  mx-auto">
            <TabGroup className={'w-full'}>
              <TabList className="border-b border-gray-200 flex -mb-px">
                <Tab className={'focus:outline-none border-b-2 py-6 hover:border-gray-300 hover:text-gray-800 text-gray-700 not-last:mr-8 border-transparent aria-selected:text-indigo-600 aria-selected:border-indigo-600 whitespace-nowrap font-medium text-sm/5'}>Customer Reviews</Tab>
                <Tab className={'focus:outline-none border-b-2 py-6 hover:border-gray-300 hover:text-gray-800 text-gray-700 not-last:mr-8 border-transparent aria-selected:text-indigo-600 aria-selected:border-indigo-600 whitespace-nowrap font-medium text-sm/5'}>FAQ</Tab>
                <Tab className={'focus:outline-none border-b-2 py-6 hover:border-gray-300 hover:text-gray-800 text-gray-700 not-last:mr-8 border-transparent aria-selected:text-indigo-600 aria-selected:border-indigo-600 whitespace-nowrap font-medium text-sm/5'}>License</Tab>
              </TabList>
              <TabPanels>
                <TabPanel className={'focus:outline-none'}>
                  <div>

                    {/* Review */}
                    <div className="flex text-gray-500 group text-sm/5">
                      <div className="py-10 mr-4">
                        <div className="block size-10">
                          <img src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80" className="rounded-full" />
                        </div>
                      </div>
                      <div className="py-10 border-t group-first:border-transparent border-gray-200">
                        <h3 className="text-gray-900 font-medium">Emily Selman</h3>
                        <p className="text-gray-500 text-sm/5">
                          <time dateTime="2021-07-16">July 16, 2021</time>
                        </p>
                        <div className="mt-4 flex items-center">
                          <Star className="size-5 fill-yellow-400 stroke-none" />
                          <Star className="size-5 fill-yellow-400 stroke-none" />
                          <Star className="size-5 fill-yellow-400 stroke-none" />
                          <Star className="size-5 fill-yellow-400 stroke-none" />
                          <Star className="size-5 fill-gray-300 stroke-none" />
                        </div>
                        <div className="mt-4">
                          <p className="text-gray-500 text-sm/5">
                            This icon pack is just what I need for my latest project. There's an icon for just about anything I could ever need. Love the playful look!
                          </p >
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
                      <div className="py-10 border-t group-first:border-transparent border-gray-200">
                        <h3 className="text-gray-900 font-medium">Emily Selman</h3>
                        <p className="text-gray-500 text-sm/5">
                          <time dateTime="2021-07-16">July 16, 2021</time>
                        </p>
                        <div className="mt-4 flex items-center">
                          <Star className="size-5 fill-yellow-400 stroke-none" />
                          <Star className="size-5 fill-yellow-400 stroke-none" />
                          <Star className="size-5 fill-yellow-400 stroke-none" />
                          <Star className="size-5 fill-yellow-400 stroke-none" />
                          <Star className="size-5 fill-gray-300 stroke-none" />
                        </div>
                        <div className="mt-4">
                          <p className="text-gray-500 text-sm/5">
                            This icon pack is just what I need for my latest project. There's an icon for just about anything I could ever need. Love the playful look!
                          </p >
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel className={'focus:outline-none pt-10'}>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm/5" >
                      What format are these icons?
                    </h3>
                    <p className="mt-2 text-gray-500 text-sm/5">
                      The icons are in SVG (Scalable Vector Graphic) format. They can be imported into your design tool of choice and used directly in code.
                    </p >
                  </div>
                  <div className="mt-10">
                    <h3 className="font-medium text-gray-900 text-sm/5" >
                      What format are these icons?
                    </h3>
                    <p className="mt-2 text-gray-500 text-sm/5">
                      The icons are in SVG (Scalable Vector Graphic) format. They can be imported into your design tool of choice and used directly in code.
                    </p >
                  </div>
                  <div className="mt-10">
                    <h3 className="font-medium text-gray-900 text-sm/5" >
                      What format are these icons?
                    </h3>
                    <p className="mt-2 text-gray-500 text-sm/5">
                      The icons are in SVG (Scalable Vector Graphic) format. They can be imported into your design tool of choice and used directly in code.
                    </p >
                  </div>
                </TabPanel>
                <TabPanel className={'focus:outline-none pt-10 text-gray-500 text-sm/5'}>
                  <div>
                    <h3 className="font-medium text-gray-900" >
                      Overview
                    </h3>
                    <p className="mt-2">
                      For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.
                    </p >
                    <ul role="list" className="pl-5 text-inherit list-disc mt-4">
                      <li className="not-first-of-type:mt-1">You're allowed to use the icons in unlimited projects.</li>
                      <li className="not-first-of-type:mt-1">You're allowed to use the icons in unlimited projects.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mt-5 text-gray-900" >
                      What you can do with it
                    </h3>
                    <ul role="list" className="pl-5 text-inherit list-disc my-4">
                      <li className=" not-first-of-type:mt-1">Use them freely in your personal and professional work.</li>
                      <li className=" not-first-of-type:mt-1">You're allowed to use the icons in unlimited projects.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mt-5 text-gray-900" >
                      What you can't do with it
                    </h3>
                    <ul role="list" className="pl-5 text-inherit list-disc my-4">
                      <li className=" not-first-of-type:mt-1">Don't be greedy. Selling or distributing these icons in their original or modified state is prohibited.</li>
                      <li className=" not-first-of-type:mt-1">You're allowed to use the icons in unlimited projects.</li>
                    </ul>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>

          </div>
        </div>
    </div>
  );
}
