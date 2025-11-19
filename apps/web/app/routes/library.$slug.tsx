import type { Route } from "./+types/library.$slug";
import Section from "~/components/section";
import Paragraph from "~/components/core/paragraph";
import Heading from "~/components/core/heading";
import { Check, ChevronLeft, Flame, Star } from "lucide-react";
import FaqAccordion from "~/sections/faq/accordion";
import { data, Link, useFetcher } from "react-router";
import Button from "~/components/core/button";
import Panel from "~/components/core/panel";
import { PlanData } from "@bw/core";
import { eq } from "drizzle-orm";
import { useCart } from "~/context/cart";
import { includes } from "lodash";
import { Fragment } from "react/jsx-runtime";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const product = await context.postgres.select().from(PlanData).where(eq(PlanData.slug, params.slug)).then(x => x.at(0))

  if (product == undefined) {
    throw data(`item ${params.slug} does not exist`, 404)
  }

  return data(product)
}

export async function action({ request }: Route.ActionArgs) {
  // add product to cart

  return data({})
}

export default ({ loaderData }: Route.ComponentProps) => {
  const cart = useCart()
  const included = cart.includes(loaderData.type, loaderData.id)

  const onToggle = () => {
    if (included) {
      cart.pop(loaderData.type, loaderData.id)
    }
    else {
      cart.push(loaderData.type, loaderData.id)
    }
  }

  return (
    <div>
      <Section className="" >
        <Link relative="path" to='..' className="block w-fit">
          <Heading size="h4" className="w-fit">
            <span className=" flex gap-x-2 items-center w-fit">
              <ChevronLeft className="size-4" />
              Back to library
            </span>
          </Heading>
        </Link>
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-end">
          <div>
            <Heading size="h1" className="">{loaderData.name}</Heading>
            <div className="mt-4 flex items-center gap-x-4">
              <div className=" flex items-center">
                <Star className="size-6 fill-yellow-400 stroke-none" />
                <Star className="size-6 fill-yellow-400 stroke-none" />
                <Star className="size-6 fill-yellow-400 stroke-none" />
                <Star className="size-6 fill-yellow-400 stroke-none" />
                <Star className="size-6 fill-gray-300 stroke-none" />
              </div>
              <div className=" h-4 w-px rounded-full bg-gray-400" />
              <Paragraph>
                {Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }).format(loaderData.created_at)}
              </Paragraph>
            </div>
          </div>
          {/* <button className="ring-1 flex items-center gap-2 w-fit mt-6 ring-white/10 dark:text-gray-400 hover:bg-white/5 dark:hover:text-yellow-400 p-1.5 rounded-md">
            <Star strokeWidth={1.5} className="size-5" />
            <Paragraph size="sm" >
              Add to favorites
            </Paragraph>
          </button> */}
        </div>
        <div className="block md:hidden mt-6">
          <div className="relative overflow-hidden rounded-2xl ring-1 shadow-xl ring-gray-900/5 dark:ring-white/5">
            <img src={loaderData.script.image} className="aspect-4/3" />
          </div>
        </div>
        <div className="hidden md:block mt-6">
          <div className="relative overflow-hidden rounded-2xl ring-1 shadow-xl ring-gray-900/5 dark:ring-white/5 h-[500px]">
            <img src={loaderData.script.image} className="absolute ring-1 w-[calc(100%+6px)] h-[500px] overflow-hidden" />
            {/* <iframe src="https://s.tradingview.com/embed/ItnS5Inz" className="absolute -inset-x-1 outline-0 -top-px -bottom-6 ring w-[calc(100%+6px)] h-[524px] overflow-hidden" /> */}
          </div>
        </div>
        <div className="gap-4 mt-6 flex flex-wrap">
          <div className="ring-1 ring-indigo-400 rounded-full py-1 px-4">
            <Paragraph size="sm" className="font-medium  dark:text-indigo-400">
              Indicator
            </Paragraph>
          </div>
          <div className="ring-1 ring-indigo-400 rounded-full py-1 px-4">
            <Paragraph size="sm" className="font-medium dark:text-indigo-400">
              Volume Based
            </Paragraph>
          </div>
          <div className="ring-1 ring-indigo-400 rounded-full py-1 px-4">
            <Paragraph size="sm" className="font-medium dark:text-indigo-400">
              Liquidity
            </Paragraph>
          </div>
          <div className="ring-1 ring-indigo-400 rounded-full py-1 px-4">
            <Paragraph size="sm" className="font-medium  dark:text-indigo-400">
              Indicator
            </Paragraph>
          </div>
          {/* <div className="ring-1 ring-indigo-400 rounded-full py-1 px-4">
              <Paragraph size="sm" className="font-medium dark:text-indigo-400">
                Volume Based
              </Paragraph>
            </div>
            <div className="ring-1 ring-indigo-400 rounded-full py-1 px-4">
              <Paragraph size="sm" className="font-medium dark:text-indigo-400">
                Liquidity
              </Paragraph>
            </div> */}
        </div>
        <div className=" xl:gap-x-16 mt-24 lg:gap-y-10 gap-y-16 lg:gap-x-8 lg:grid-cols-7 lg:grid-rows-1 grid">
          {/* Image */}


          {/* Details */}
          <div className="lg:max-w-none lg:col-span-3 lg:row-end-1 lg:row-span-1 max-w-2xl  mx-auto">
            <Panel color="gradient" className="xl:p-10 p-10 sm:p-10">
              <div className="flex justify-between">
                <Heading size="h3" className="text-lg sm:text-xl">Get Access</Heading>
                <div className="px-3 py-1 bg-indigo-400 rounded-full">
                  <Paragraph size="sm" className="text-white gap-x-2 items-center flex dark:text-white font-medium">
                    <Flame className="size-4" />
                    Trending
                  </Paragraph>
                </div>
              </div>
              <Paragraph className="mt-4">
                The essentials to provide your best work for clients.
              </Paragraph>
              <div className="mt-6 flex gap-x-1 items-end">
                <Heading size="h1">$299</Heading>
                <Paragraph>
                  /year
                </Paragraph>
              </div>
              <Button onClick={onToggle} className="w-full mt-6">
                {included ? (
                  <Fragment>
                    <Check />
                    <span>Added to Toolbox</span>
                  </Fragment>
                ) : (
                  <span>Add to Toolbox</span>
                )}
              </Button>
              <ul className="xl:mt-10 dark:text-gray-300 text-sm/6 mt-8">
                <li className="flex gap-x-3 not-last:mb-3">
                  <Check className="text-indigo-400" />
                  Live Alerts
                </li>
                <li className="flex gap-x-3 not-last:mb-3">
                  <Check className="text-indigo-400" />
                  Trade Signals
                </li>
                <li className="flex gap-x-3 not-last:mb-3">
                  <Check className="text-indigo-400" />
                  Advanced analytics
                </li>
                <li className="flex gap-x-3 not-last:mb-3">
                  <Check className="text-indigo-400" />
                  Adjustable Settings
                </li>
                <li className="flex gap-x-3 not-last:mb-3">
                  <Check className="text-indigo-400" />
                  24/7 Support
                </li>
              </ul>
            </Panel>
          </div>

          <div className="lg:row-end-2 lg:row-span-2 lg:col-start-1 lg:col-span-4 max-w-2xl mx-auto">
            <Heading size="h3" className="">Description</Heading>
            <Paragraph className="mt-6">
              The Triple Gaussian Smoothed Ribbon is a next-generation market visualization framework built on the principles of Gaussian filtering - a mathematical model from digital signal processing designed to remove noise while preserving the integrity of the underlying trend.              <br />
            </Paragraph>
            <Paragraph className="mt-6">
              Developed under the Adaptive Gaussian Framework, this indicator extends the classical Gaussian model into a multi-stage smoothing and visualization system. By layering three progressive Gaussian filters and rendering their interactions as a gradient-based ribbon field, it translates market energy into a coherent, visually structured trend environment. Each ribbon layer represents a progressively smoothed component of price motion, producing a high-fidelity gradient field that evolves in sync with real-time trend strength and momentum.
            </Paragraph>

            <Heading size="h4" className="mt-12 dark:text-white text-lg">
              How to trade this indicator?
            </Heading>
            <Paragraph className="mt-6">
              Developed under the Adaptive Gaussian Framework, this indicator extends the classical Gaussian model into a multi-stage smoothing and visualization system. By layering three progressive Gaussian filters and rendering their interactions as a gradient-based ribbon field, it translates market energy into a coherent, visually structured trend environment. Each ribbon layer represents a progressively smoothed component of price motion, producing a high-fidelity gradient field that evolves in sync with real-time trend strength and momentum.
            </Paragraph>
            <Heading size="h4" className="mt-12 dark:text-white text-lg">
              How to identify trending markets?
            </Heading>
            <Paragraph className="mt-6">
              Developed under the Adaptive Gaussian Framework, this indicator extends the classical Gaussian model into a multi-stage smoothing and visualization system. By layering three progressive Gaussian filters and rendering their interactions as a gradient-based ribbon field, it translates market energy into a coherent, visually structured trend environment. Each ribbon layer represents a progressively smoothed component of price motion, producing a high-fidelity gradient field that evolves in sync with real-time trend strength and momentum.
            </Paragraph>

          </div>

          <div className="lg:max-w-none lg:col-span-3 lg:row-end-2 lg:row-span-1 max-w-2xl  mx-auto">
            <div className="flex text-gray-500 group text-sm/5">
              <div className="py-10 mr-4">
                <div className="block size-10">
                  <img src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80" className="rounded-full" />
                </div>
              </div>
              <div className="py-10 border-t border-gray-900/10 dark:border-white/10">
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
            <div className="flex text-gray-500 group text-sm/5">
              <div className="py-10 mr-4">
                <div className="block size-10">
                  <img src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80" className="rounded-full" />
                </div>
              </div>
              <div className="py-10 border-t border-gray-900/10 dark:border-white/10">
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
            <div className="flex text-gray-500 group text-sm/5">
              <div className="py-10 mr-4">
                <div className="block size-10">
                  <img src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80" className="rounded-full" />
                </div>
              </div>
              <div className="py-10 border-t border-gray-900/10 dark:border-white/10">
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



            {/* <div className="flex flex-col-reverse">
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
            </div> */}
            {/* <Paragraph className="mt-6">
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
            </div> */}
            {/* <Panel className="grow flex p-6 sm:p-6 sm:py-6 lg:py-6 py-6  ">
              <div className="ring-1 ring-white/10 bg-zinc-900 p-24 rounded-xl h-full w-full">
                test
              </div>
            </Panel> */}
          </div>

          {/* Tabs */}

        </div>
      </Section>
      {/* <ContentTiles/>
      <FaqAccordion /> */}
      {/* <ContentPanel/> */}
      <FaqAccordion />
      {/* <ProductOverview /> */}
      {/* <ProductList heading="Others also bought" /> */}
    </div>
  );
}