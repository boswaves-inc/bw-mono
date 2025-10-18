import type { Route } from "./+types/_store._index";

import HeroScreenshot from "~/components/sections/hero/screenshot";
import TestemonialsGrid from "~/components/sections/testemonials/grid";
import Button from "~/components/core/button";
import Heading from "~/components/core/heading";
import ContentPanel from "~/components/sections/content/panel";
import { postgres } from "~/services";
import { User } from "~/models/user";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ }: Route.LoaderArgs) {
  const s = await postgres.select().from(User)

  console.log(s)

  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function renderer() {
  return (
    <div className="">
      <HeroScreenshot />

      <div className="overflow-hidden bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pt-4 lg:pr-8">
              <div className="lg:max-w-lg">
                <Heading size="h4">
                  Deploy faster
                </Heading>
                <Heading size="h1" className="mt-2">
                  Level up your trades
                </Heading>
                <p className="mt-6 text-lg/8 text-gray-300">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque,
                  iste dolor cupiditate blanditiis ratione.
                </p>
                {/* <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-400 lg:max-w-none">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                    <feature.icon aria-hidden="true" className="absolute top-1 left-1 size-5 text-indigo-400" />
                    {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                    </div>
                    ))}
                    </dl> */}
                <div className="mt-10 flex items-center  gap-x-6">
                  <Button >Get Started</Button>
                  <a href="#" className="text-sm/6 font-semibold text-gray-900 dark:text-white">Learn more <span aria-hidden="true">→</span></a>
                </div>
              </div>
            </div>
            <img
              alt="Product screenshot"
              src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75"
              width={2432}
              height={1442}
              className="w-3xl max-w-none z-10 rounded-xl shadow-xl ring-1 dark:ring-white/5 ring-gray-900/5 sm:w-228 md:-ml-4 lg:-ml-0"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className=" lg:order-first justify-end items-start flex">
              <img
                alt="Product screenshot"
                src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Fshowcases%2Fshowcase_6.png&w=3840&q=75"
                width={2432}
                height={1442}
                className="w-3xl max-w-none z-10 rounded-xl shadow-xl ring-1  dark:ring-white/5 ring-gray-900/5 sm:w-228 md:-mr-4 lg:-mr-0"
              />

            </div>
            <div className="lg:pt-4 lg:pr-8">
              <div className="lg:max-w-lg ">
                <Heading size="h4">
                  Deploy faster
                </Heading>
                <Heading size="h1" className="mt-2">
                  Pricing that grows with you
                </Heading>
                <p className="mt-6 text-lg/8 text-gray-300">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque,
                  iste dolor cupiditate blanditiis ratione.
                </p>
                <div className="mt-10 flex items-center  gap-x-6">
                  <Button >Get Started</Button>
                  <a href="#" className="text-sm/6 font-semibold text-gray-900 dark:text-white">Learn more <span aria-hidden="true">→</span></a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <ContentPanel />
      {/* <ContentTiles /> */}
      <TestemonialsGrid />
    </div>
  );
}
