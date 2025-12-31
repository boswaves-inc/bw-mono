import { data, Link } from "react-router";
import { Container } from "~/components/v3/container";
import { Heading, Subheading } from "~/components/v3/core/typography";
import type { Route } from "./+types/pricing.$slug";
import dayjs from "dayjs";
import { and, eq } from "drizzle-orm";
import { Item, ItemPrice, ItemScript, PeriodUnit, Script } from "@boswaves/core";
import { Button } from "~/components/v3/core/button";
import { Plus, PlusIcon } from "lucide-react";
import { Markdown } from "~/components/v3/core/markdown";

export const links: Route.LinksFunction = () => [
    { rel: "preconnect", href: "https://s.tradingview.com/embed/ItnS5Inz" },
];

export async function loader({ params, context: { postgres, geo } }: Route.LoaderArgs) {
    const period_unit: PeriodUnit = 'month'
    const item = await postgres.select({
        id: Item.id,
        name: Item.name,
        type: Item.type,
        slug: Item.slug,
        status: Item.status,
        script: Script,
        excerpt: Item.excerpt,
        description: Item.description,
        created_at: Item.created_at,
        updated_at: Item.updated_at,
        item_price: ItemPrice
    }).from(Item)
        .innerJoin(ItemScript, eq(ItemScript.item_id, Item.id))
        .innerJoin(Script, eq(Script.id, ItemScript.id))
        .innerJoin(ItemPrice,
            and(
                eq(ItemPrice.status, 'active'),
                eq(ItemPrice.item_id, Item.id),
                eq(ItemPrice.period_unit, period_unit),
                eq(ItemPrice.currency_code, geo.currency),
            )
        )
        .where(
            and(
                eq(Item.type, 'plan'),
                eq(Item.status, 'active'),
                eq(Item.slug, params.slug)
            )
        )
        .limit(1)
        .then(x => x.at(0))

    if (item == undefined) {
        throw new Error(`Item '${params.slug}' does not exist`)
    }

    return data(item)
}

export default ({ loaderData: { name, description, script, created_at } }: Route.ComponentProps) => (
    <div className="overflow-hidden">
        <Container className="mt-16 lg:pb-24">
            <Subheading >
                {dayjs(created_at).format('dddd, MMMM D, YYYY')}
            </Subheading>
            <Heading size="h1" className="mt-2">
                {name}
            </Heading>
            <div className="flex mt-4 flex-wrap gap-2">
                <Link to={`/blog?category=`} className="rounded-full border border-dotted border-gray-300 bg-gray-50 px-2 text-sm/6 font-medium text-gray-500">
                    Indicator
                </Link>
                <Link to={`/blog?category=`} className="rounded-full border border-dotted border-gray-300 bg-gray-50 px-2 text-sm/6 font-medium text-gray-500">
                    Volume Based
                </Link>
                <Link to={`/blog?category=`} className="rounded-full border border-dotted border-gray-300 bg-gray-50 px-2 text-sm/6 font-medium text-gray-500">
                    Trend Following
                </Link>
            </div>
            {/* <div className={'mt-16 h-auto sm:h-auto aspect-video sm:w-full relative [--radius:var(--radius-xl)]'}>
                <div className="absolute -inset-(--padding) rounded-[calc(var(--radius)+var(--padding))] shadow-xs ring-1 ring-black/5 [--padding:--spacing(2)]" />
                <div className="rounded-lg relative object-cover object-left h-full w-full shadow-2xl overflow-hidden ring-1 ring-black/10">
                    <iframe loading="eager" src="https://s.tradingview.com/embed/ItnS5Inz" className="absolute w-[calc(100%+6px)] h-[calc(100%+24px)] -top-px -inset-x-1" />
                </div>
            </div> */}
            <div className={'mt-16 h-auto sm:h-auto sm:w-full relative [--radius:var(--radius-xl)]'}>
                <div className="absolute -inset-(--padding) rounded-[calc(var(--radius)+var(--padding))] shadow-xs ring-1 ring-black/5 [--padding:--spacing(2)]" />
                <div className="relative overflow-hidden rounded-2xl ring-1 shadow-xl ring-gray-900/5 dark:ring-white/5 h-[500px]">
                    <img src={script.image} className="absolute ring-1 w-[calc(100%+6px)] h-[500px] overflow-hidden" />
                    {/* <iframe src="https://s.tradingview.com/embed/ItnS5Inz" className="absolute -inset-x-1 outline-0 -top-px -bottom-6 ring w-[calc(100%+6px)] h-[524px] overflow-hidden" /> */}
                </div>
            </div>
        </Container>

        <Container className="mt-16 pb-24 ">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
                <div className=" lg:col-span-2  max-w-2xl text-gray-700 ">
                    <Markdown content={description} className="*:first:mt-0!" />
                </div>
                <div className="-m-2 grid grid-cols-1 rounded-4xl shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 h-fit ring-black/5 ">
                    <div className="grid grid-cols-1 rounded-4xl p-2 shadow-md shadow-black/5">
                        <div className="rounded-3xl w bg-white p-10 pb-9 shadow-2xl ring-1 ring-black/5">
                            <Subheading>
                                Monthly subscription
                            </Subheading>
                            <p className="mt-2 text-sm/6 text-gray-950/75">
                                Everything you need to start selling.
                            </p>
                            <div className="mt-8 flex items-center gap-4">
                                <div className="text-5xl font-medium text-gray-950">
                                    $99
                                </div>
                                <div className="text-sm/5 text-gray-950/75">
                                    <p>USD</p>
                                    <p>per month</p>
                                </div>
                            </div>
                            <div className="mt-8">
                                <Button >
                                    <Plus />
                                    Add to toolbox
                                </Button>
                            </div>
                            <div className="mt-8">
                                <h3 className="text-sm/6 font-medium text-gray-950">
                                    Start selling with:
                                </h3>
                                <ul className="mt-3 space-y-3">
                                    <li className="flex items-start gap-4 text-sm/6 text-gray-950/75 data-disabled:text-gray-950/25">
                                        <span className="inline-flex h-6 items-center">
                                            <PlusIcon className="size-3.75 shrink-0 fill-gray-950/25" />
                                        </span>
                                        <span className="sr-only">Not included:</span>
                                        Up to 3 team members
                                    </li>
                                    <li className="flex items-start gap-4 text-sm/6 text-gray-950/75 data-disabled:text-gray-950/25">
                                        <span className="inline-flex h-6 items-center">
                                            <PlusIcon className="size-3.75 shrink-0 fill-gray-950/25" />
                                        </span>
                                        <span className="sr-only">Not included:</span>
                                        Up to 5 deal progress boards
                                    </li>
                                    <li className="flex items-start gap-4 text-sm/6 text-gray-950/75 data-disabled:text-gray-950/25">
                                        <span className="inline-flex h-6 items-center">
                                            <PlusIcon className="size-3.75 shrink-0 fill-gray-950/25" />
                                        </span>
                                        <span className="sr-only">Not included:</span>
                                        Source leads from select platforms
                                    </li>
                                    <li className="flex items-start gap-4 text-sm/6 text-gray-950/75 data-disabled:text-gray-950/25">
                                        <span className="inline-flex h-6 items-center">
                                            <PlusIcon className="size-3.75 shrink-0 fill-gray-950/25" />
                                        </span>
                                        <span className="sr-only">Not included:</span>
                                        RadiantAI integrations
                                    </li>
                                    <li className="flex items-start gap-4 text-sm/6 text-gray-950/75 data-disabled:text-gray-950/25">
                                        <span className="inline-flex h-6 items-center">
                                            <PlusIcon className="size-3.75 shrink-0 fill-gray-950/25" />
                                        </span>
                                        <span className="sr-only">Not included:</span>
                                        5 competitor analyses per month
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>

        <div style={{ backgroundImage: 'url(texture.svg)' }} className="mx-2 my-24 rounded-4xl bg-gray-900 pt-72 pb-24 lg:pt-36">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-[384px_1fr_1fr]">
                    <div className="-mt-96 lg:-mt-52">
                        <div className="-m-2 rounded-4xl bg-white/15 shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:max-w-xs">
                            <div className="rounded-4xl p-2 shadow-md shadow-black/5">
                                <div className="overflow-hidden rounded-3xl shadow-2xl outline -outline-offset-1 outline-black/10">
                                    <img
                                        alt=""
                                        src="/testimonials/tina-yards.jpg"
                                        className="aspect-3/4 w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex max-lg:mt-16 lg:col-span-2 lg:px-16">
                        <figure className="mx-auto flex max-w-xl flex-col gap-16 max-lg:text-center">
                            <blockquote>
                                <p className="relative text-3xl tracking-tight text-white before:absolute before:-translate-x-full before:content-['“'] after:absolute after:content-['”'] lg:text-4xl">
                                    Thanks to Radiant, we&apos;re finding new leads that we never
                                    would have found with legal methods.
                                </p>
                            </blockquote>
                            <figcaption className="mt-auto">
                                <p className="text-sm/6 font-medium text-white">Tina Yards</p>
                                <p className="text-sm/6 font-medium">
                                    <span className="bg-linear-to-r from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#b060ff] bg-clip-text text-transparent">
                                        VP of Sales, Protocol
                                    </span>
                                </p>
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </Container>
        </div>

        {/* FAQ */}
        <Container >
            <section id="faqs" className="scroll-mt-8">
                <Subheading className="text-center">
                    Frequently asked questions
                </Subheading>
                <Heading className="mt-2 text-center">
                    Your questions answered.
                </Heading>
                <div className="mx-auto mt-16 mb-32 max-w-xl space-y-12">
                    <dl>
                        <dt className="text-sm font-semibold">
                            What measures are in place to ensure the security of our data?
                        </dt>
                        <dd className="mt-4 text-sm/6 text-gray-600">
                            Data security is a top priority for us, which is ironic given that
                            our business depends on others not taking it very seriously. We
                            understand that any breach could put both us and most of our
                            customers out of business—and behind bars. We employ robust
                            security measures, including data encryption, secure data centers,
                            and regular security audits to ensure this never happens.
                        </dd>
                    </dl>
                    <dl>
                        <dt className="text-sm font-semibold">
                            Is there a mobile app available for your platform?
                        </dt>
                        <dd className="mt-4 text-sm/6 text-gray-600">
                            Yes, we offer a mobile app that provides all the key
                            functionalities of our desktop platform, allowing sales reps to
                            manage deals on the go. Additionally, we have another app
                            pre-installed on most modern smartphones that allows us to track
                            your location, listen to your conversations, and access your
                            camera and microphone at any time. This app is not available for
                            download.
                        </dd>
                    </dl>
                    <dl>
                        <dt className="text-sm font-semibold">
                            Can I customize the workflow to match our company’s deal process?
                        </dt>
                        <dd className="mt-4 text-sm/6 text-gray-600">
                            Yes, our platform is highly customizable, although there should be
                            no need. Before you sign up, we discreetly gather information
                            about your company and its processes from a variety of sources. We
                            then use this information to pre-configure the platform to match
                            your existing workflows. This is why we ask for your social
                            security number and access to your email account during the
                            sign-up process.
                        </dd>
                    </dl>
                    <dl>
                        <dt className="text-sm font-semibold">
                            What kind of support do you offer?
                        </dt>
                        <dd className="mt-4 text-sm/6 text-gray-600">
                            We offer comprehensive support through multiple channels,
                            including 24/7 live chat, email, and phone support. However, since
                            we have full access to your internal network, we will know if
                            you’re having issues before you do.
                        </dd>
                    </dl>
                    <dl>
                        <dt className="text-sm font-semibold">
                            Can I integrate the CRM with other sales intelligence tools?
                        </dt>
                        <dd className="mt-4 text-sm/6 text-gray-600">
                            Yes, our solution integrates seamlessly with a variety of other
                            systems. However, be warned that most of these integrations are
                            short-lived. We have a dedicated team of engineers who
                            reverse-engineer the APIs of other tools, enabling us to build
                            their functionality into our product and eventually put them out
                            of business.
                        </dd>
                    </dl>
                </div>
            </section>
        </Container>
    </div>
)