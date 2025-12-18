import { Link, type MetaArgs } from "react-router";
import type { Route } from "../+types/root";

import { Button } from "~/components/core/v2/button";
import { Heading, Paragraph } from "~/components/core/v2/typography";
import Page from "~/components/page";
import Section from "~/components/section";

export function meta({ }: MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ }: Route.LoaderArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function renderer() {
  return (
    <Page>
      <Section className="relative isolate">
        <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"></div>
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"></div>
        </div>
        <div className="text-center max-w-2xl mx-auto">
          <Heading className="mt-8">Build your toolbox.</Heading>
          <Paragraph size="lg" variant="muted" className="mt-8 text-pretty font-medium">
            BOSWaves redefines what a trading toolkit should be - customizable, efficient, and built entirely around your needs. Your toolbox, your strategy, your terms.
          </Paragraph>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild >
              <Link to={'#'}>
                Get Started
              </Link>
            </Button>
            <Button size="lg" variant="link" className="text-foreground" asChild>
              <Link to={'#'}>
                Learn more
              </Link>
            </Button>
          </div>
        </div>
        <img className="h-auto max-w-full mt-16 sm:mt-24 rounded-md shadow-2xl border" src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75" />
      </Section>

      <Section>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <Heading size="h4">
                Industry Leading
              </Heading>
              <Heading className="mt-2">
                Supercharge your trades
              </Heading>
              <Paragraph variant="muted" className="mt-6">
                We engineer advanced, data-driven algorithms and modular trading tools that adapt to your strategy - empowering you to trade smarter, faster, and with absolute precision.
              </Paragraph>
              <div className="mt-10 flex items-center gap-x-6">
                <Button size="lg" asChild>
                  <Link to={'#'}>
                    Get Started
                  </Link>
                </Button>
                <Button size="lg" variant="link" className="text-foreground" asChild>
                  <Link to={'#'}>
                    Learn more
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <img
            alt="Product screenshot"
            src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75"
            width={2432}
            height={1442}
            className="w-3xl max-w-none z-10 rounded-xl shadow-xl ring-1 dark:ring-white/5 ring-gray-900/5 sm:w-228 md:-ml-4 lg:ml-0"
          />
        </div>
      </Section>

      <Section>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className=" lg:order-first justify-end items-start flex">
            <img
              alt="Product screenshot"
              src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Fshowcases%2Fshowcase_6.png&w=3840&q=75"
              width={2432}
              height={1442}
              className="w-3xl max-w-none z-10 rounded-xl shadow-xl ring-1  dark:ring-white/5 ring-gray-900/5 sm:w-228 md:-mr-4 lg:mr-0"
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
              <Paragraph variant="muted" className="mt-6">
                You choose the indicators, modules, and insights you need, and only pay for what delivers real value. No clutter. No overpricing. Just precision-built trading - tailored to you
              </Paragraph>
              <div className="mt-10 flex items-center  gap-x-6">
                <Button >Get Started</Button>
                <a href="#" className="text-sm/6 font-semibold text-gray-900 dark:text-white">Learn more <span aria-hidden="true">→</span></a>
              </div>
            </div>
          </div>

        </div>
      </Section>
    </Page>
  );
}
