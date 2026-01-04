import { Link, type MetaArgs } from "react-router";
import type { Route } from "../+types/root";

import Section from "~/components/section";
import { Container } from "~/components/v3/container";
import { Button } from "~/components/v3/core/button";
import { Gradient } from "~/components/v3/gradient";
import { Navigation } from "~/components/v3/navbar";
import { ArrowRight, ChevronRightIcon } from "lucide-react";
import { LogoCloud } from "~/components/v3/sections/logo-cloud";
import { Heading, Subheading } from "~/components/v3/core/typography";
import { Screenshot } from "~/components/v3/screenshot";
import { Bento } from "~/components/v3/bento";
import { LogoTimeline } from "~/components/v3/graphic/logo-timeline";
import { LinkedAvatars } from "~/components/v3/graphic/linked-avatars";
import { Keyboard } from "~/components/v3/graphic/keyboard";
import { LogoCluster } from "~/components/v3/graphic/logo-cluster";
import { Atlas } from "~/components/v3/graphic/atlas";
import { cn } from "~/utils/class";
import { Testemonials } from "~/components/v3/sections/testemonials";
import { Footer } from "~/components/layout/footer";

export function meta({ }: MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context: { cdn } }: Route.LoaderArgs) {
  const ss = await cdn.read_file('bcda437e-d7f5-4cca-aed1-9d92f049c5b6', {

  })

  console.log(ss)

  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function renderer() {
  return (
    <div className="overflow-hidden">

      {/* Hero */}
      <div className="relative">
        <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
        <Container className="relative">

          <Navigation>
            <Link to={'/blog/radiant-raises-100m-series-a-from-tailwind-ventures'} className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium text-white data-hover:bg-fuchsia-950/30">
              BosWaves raises $100M Series A from Tailwind Ventures
              <ChevronRightIcon className="size-4" />
            </Link>
          </Navigation>

          <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
            <h1 className="font-display text-6xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-8xl/[0.8] md:text-9xl/[0.8]">
              Close every deal.
            </h1>
            <p className="mt-8 max-w-lg text-xl/7 font-medium text-gray-950/75 sm:text-2xl/8">
              BosWaves helps you sell more by revealing sensitive information about
              your customers.
            </p>
            <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
              <Button>
                Get started
              </Button>
              <Button variant="secondary" >
                See pricing
              </Button>
            </div>
          </div>
        </Container>
      </div>


      <main>
        <Container className="mt-10">
          <LogoCloud />
        </Container>
        <div className="bg-linear-to-b from-white from-50% to-gray-100 py-32">

          {/* Feature */}
          <div className="overflow-hidden">
            <Container className="pb-24">
              <Heading size="h2" className="max-w-3xl">
                A snapshot of your entire sales pipeline.
              </Heading>
              <Screenshot src="/screenshots/app.png" className="mt-16 h-144 sm:h-auto aspect-19/12 sm:w-304" />
            </Container>
          </div>

          {/* Bento */}
          <Container>
            <Subheading>Sales</Subheading>
            <Heading size="h3" className="mt-2 max-w-3xl">
              Know more about your customers than they do.
            </Heading>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
              <Bento
                eyebrow="Insight"
                title="Get perfect clarity"
                description="BosWaves uses social engineering to build a detailed financial picture of your leads. Know their budget, compensation package, social security number, and more."
                graphic={
                  <div className="h-80 bg-[url(/screenshots/profile.png)] bg-size-[1000px_560px] bg-position-[left_-109px_top_-112px] bg-no-repeat" />
                }
                fade={['bottom']}
                className="max-lg:rounded-t-4xl lg:col-span-3 lg:rounded-tl-4xl"
              />
              <Bento
                eyebrow="Analysis"
                title="Undercut your competitors"
                description="With our advanced data mining, you’ll know which companies your leads are talking to and exactly how much they’re being charged."
                graphic={
                  <div className="absolute inset-0 bg-[url(/screenshots/competitors.png)] bg-size-[1100px_650px] bg-position-[left_-38px_top_-73px] bg-no-repeat" />
                }
                fade={['bottom']}
                className="lg:col-span-3 lg:rounded-tr-4xl"
              />
              <Bento
                eyebrow="Speed"
                title="Built for power users"
                description="It’s never been faster to cold email your entire contact list using our streamlined keyboard shortcuts."
                graphic={
                  <div className="flex size-full pt-10 pl-10">
                    <Keyboard highlighted={['LeftCommand', 'LeftShift', 'D']} />
                  </div>
                }
                className="lg:col-span-2 lg:rounded-bl-4xl"
              />
              <Bento
                eyebrow="Source"
                title="Get the furthest reach"
                description="Bypass those inconvenient privacy laws to source leads from the most unexpected places."
                graphic={<LogoCluster />}
                className="lg:col-span-2"
              />
              <Bento
                eyebrow="Limitless"
                title="Sell globally"
                description="BosWaves helps you sell in locations currently under international embargo."
                graphic={<Atlas />}
                className="max-lg:rounded-b-4xl lg:col-span-2 lg:rounded-br-4xl"
              />
            </div>
          </Container>
        </div>

        {/* Dark Bento */}
        <div className="mx-2 mt-2 rounded-4xl dark bg-gray-900 py-32">
          <Container>
            <Subheading>Sales</Subheading>
            <Heading size="h3" className="mt-2 max-w-3xl">
              Know more about your customers than they do.
            </Heading>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
              <Bento
                eyebrow="Networking"
                title="Sell at the speed of light"
                description="Our BosWavesAI chat assistants analyze the sentiment of your conversations in real time, ensuring you're always one step ahead."
                graphic={
                  <div className="h-80 bg-[url(/screenshots/networking.png)] bg-size-[851px_344px] bg-no-repeat" />
                }
                fade={['top']}
                className="max-lg:rounded-t-4xl dark lg:col-span-4 lg:rounded-tl-4xl"
              />
              <Bento
                eyebrow="Integrations"
                title="Meet leads where they are"
                description="With thousands of integrations, no one will be able to escape your cold outreach."
                graphic={<LogoTimeline />}
                className="z-10 overflow-visible! dark lg:col-span-2 lg:rounded-tr-4xl"
              />
              <Bento
                eyebrow="Meetings"
                title="Smart call scheduling"
                description="Automatically insert intro calls into your leads' calendars without their consent."
                graphic={<LinkedAvatars />}
                className="lg:col-span-2 dark lg:rounded-bl-4xl"
              />
              <Bento
                eyebrow="Engagement"
                title="Become a thought leader"
                description="BosWavesAI automatically writes LinkedIn posts that relate current events to B2B sales, helping you build a reputation as a thought leader."
                graphic={
                  <div className="h-80 bg-[url(/screenshots/engagement.png)] bg-size-[851px_344px] bg-no-repeat" />
                }
                fade={['top']}
                className="max-lg:rounded-b-4xl dark lg:col-span-4 lg:rounded-br-4xl"
              />
            </div>
          </Container>
        </div>
      </main>

      {/* Testemonials */}
      <Testemonials />

      {/* Footer */}
      <Footer />
    </div>
    // <Page>
    //   <Section className="relative isolate">
    //     <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
    //       <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"></div>
    //     </div>
    //     <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
    //       <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"></div>
    //     </div>
    //     <div className="text-center max-w-2xl mx-auto">
    //       <Heading className="mt-8">Build your toolbox.</Heading>
    //       <Paragraph size="lg" variant="muted" className="mt-8 text-pretty font-medium">
    //         BOSWaves redefines what a trading toolkit should be - customizable, efficient, and built entirely around your needs. Your toolbox, your strategy, your terms.
    //       </Paragraph>
    //       <div className="mt-10 flex items-center justify-center gap-x-6">
    //         <Button size="lg" asChild >
    //           <Link to={'#'}>
    //             Get Started
    //           </Link>
    //         </Button>
    //         <Button size="lg" variant="link" className="text-foreground" asChild>
    //           <Link to={'#'}>
    //             Learn more
    //           </Link>
    //         </Button>
    //       </div>
    //     </div>
    //     <img className="h-auto max-w-full mt-16 sm:mt-24 rounded-md shadow-2xl border" src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75" />
    //   </Section>

    //   <Section>
    //     <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
    //       <div className="lg:pt-4 lg:pr-8">
    //         <div className="lg:max-w-lg">
    //           <Heading size="h4">
    //             Industry Leading
    //           </Heading>
    //           <Heading className="mt-2">
    //             Supercharge your trades
    //           </Heading>
    //           <Paragraph variant="muted" className="mt-6">
    //             We engineer advanced, data-driven algorithms and modular trading tools that adapt to your strategy - empowering you to trade smarter, faster, and with absolute precision.
    //           </Paragraph>
    //           <div className="mt-10 flex items-center gap-x-6">
    //             <Button size="lg" asChild>
    //               <Link to={'#'}>
    //                 Get Started
    //               </Link>
    //             </Button>
    //             <Button size="lg" variant="link" className="text-foreground" asChild>
    //               <Link to={'#'}>
    //                 Learn more
    //               </Link>
    //             </Button>
    //           </div>
    //         </div>
    //       </div>
    //       <img
    //         alt="Product screenshot"
    //         src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75"
    //         width={2432}
    //         height={1442}
    //         className="w-3xl max-w-none z-10 rounded-xl shadow-xl ring-1 dark:ring-white/5 ring-gray-900/5 sm:w-228 md:-ml-4 lg:ml-0"
    //       />
    //     </div>
    //   </Section>

    //   <Section>
    //     <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
    //       <div className=" lg:order-first justify-end items-start flex">
    //         <img
    //           alt="Product screenshot"
    //           src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Fshowcases%2Fshowcase_6.png&w=3840&q=75"
    //           width={2432}
    //           height={1442}
    //           className="w-3xl max-w-none z-10 rounded-xl shadow-xl ring-1  dark:ring-white/5 ring-gray-900/5 sm:w-228 md:-mr-4 lg:mr-0"
    //         />
    //       </div>
    //       <div className="lg:pt-4 lg:pr-8">
    //         <div className="lg:max-w-lg ">
    //           <Heading size="h4">
    //             World's First
    //           </Heading>
    //           <Heading size="h1" className="mt-2">
    //             Pricing that grows with you
    //           </Heading>
    //           <Paragraph variant="muted" className="mt-6">
    //             You choose the indicators, modules, and insights you need, and only pay for what delivers real value. No clutter. No overpricing. Just precision-built trading - tailored to you
    //           </Paragraph>
    //           <div className="mt-10 flex items-center  gap-x-6">
    //             <Button >Get Started</Button>
    //             <a href="#" className="text-sm/6 font-semibold text-gray-900 dark:text-white">Learn more <span aria-hidden="true">→</span></a>
    //           </div>
    //         </div>
    //       </div>

    //     </div>
    //   </Section>
    // </Page>
  );
}
