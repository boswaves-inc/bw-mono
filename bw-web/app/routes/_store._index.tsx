import HeroScreenshot from "~/sections/hero/screenshot";
import TestemonialsGrid from "~/sections/testemonials/grid";
import Button from "~/components/button";
import Heading from "~/components/heading";
import ContentPanel from "~/sections/content/panel";
import type { LoaderFunctionArgs, MetaArgs } from "react-router";

export function meta({ }: MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ }: LoaderFunctionArgs) {
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
                  Industry Leading
                </Heading>
                <Heading size="h1" className="mt-2">
                  Supercharge your trades
                </Heading>
                <p className="mt-6 text-lg/8 text-gray-300">
                  We engineer advanced, data-driven algorithms and modular trading tools that adapt to your strategy - empowering you to trade smarter, faster, and with absolute precision.
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
                  World's First
                </Heading>
                <Heading size="h1" className="mt-2">
                  Pricing that grows with you
                </Heading>
                <p className="mt-6 text-lg/8 text-gray-300">
                  You choose the indicators, modules, and insights you need, and only pay for what delivers real value. No clutter. No overpricing. Just precision-built trading - tailored to you
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
