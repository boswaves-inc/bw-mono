import { data, Link } from "react-router";
import { Container } from "~/components/v3/container";
import { Heading, Lead, Subheading } from "~/components/v3/core/typography";
import { Footer } from "~/components/v3/footer";
import { Gradient, GradientBackground } from "~/components/v3/gradient";
import { Navigation } from "~/components/v3/navbar";
import { LogoCloud } from "~/components/v3/sections/logo-cloud";
import type { Route } from "./+types/pricing._index";
import dayjs from "dayjs";
import { and, eq, getTableColumns } from "drizzle-orm";
import { Item, ItemPrice, ItemScript, PeriodUnit, Script } from "@boswaves/core";
import { Button } from "~/components/v3/core/button";
import { Plus } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { Markdown } from "~/components/v3/core/markdown";

export const loader = async ({ context: { postgres, geo } }: Route.LoaderArgs) => {
    const period_unit: PeriodUnit = 'month'

    const items = await postgres.select({
        ...getTableColumns(Item),
        item_script: Script,
        item_price: ItemPrice,
    }).from(Item)
        .innerJoin(ItemScript, eq(ItemScript.item_id, Item.id))
        .innerJoin(Script, eq(Script.id, ItemScript.id))
        .innerJoin(ItemPrice, and(
            eq(ItemPrice.status, 'active'),
            eq(ItemPrice.item_id, Item.id),
            eq(ItemPrice.period_unit, period_unit),
            eq(ItemPrice.currency_code, geo.currency),
        ))
        .where(and(
            eq(Item.type, 'plan'),
            eq(Item.status, 'active'),
        ))

    const featured = items.slice(0, 3)

    return data({ featured, items })
}

export default ({ loaderData: { featured, items } }: Route.ComponentProps) => (
    <Fragment>
        {/* Header */}
        <Container className="mt-16">
            <Heading size="h1">Pricing that grows with your team size.</Heading>
            <Lead className="mt-6 max-w-3xl">
                Companies all over the world have closed millions of deals with Radiant.
                Sign up today and start selling smarter.
            </Lead>
        </Container>

        {/* Featured Items */}
        <div className="relative py-24 ">
            <Gradient className="absolute inset-x-2 top-48 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
            <Container className="relative">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {featured.map(({ slug, item_script, created_at, excerpt, name }) => (
                        <div className="-m-2 grid grid-cols-1 rounded-4xl p-2 shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:w-full max-lg:max-w-md">
                            <div className="rounded-3xl bg-white p-2 shadow-2xl ring-1 ring-black/5">
                                {item_script.image && (
                                    <img
                                        src={item_script.image}
                                        className="aspect-3/2 w-full rounded-2xl object-cover"
                                    />
                                )}
                                <div className="flex flex-1 flex-col p-8">
                                    <div className="text-sm/5 text-gray-700">
                                        {dayjs(created_at).format('dddd, MMMM D, YYYY')}
                                    </div>
                                    <div className="mt-2 text-base/7 font-medium">
                                        <Link to={`./${slug}`}>
                                            <span className="absolute inset-0" />
                                            {name}
                                        </Link>
                                    </div>

                                    <div className="mt-4 pb-4 border-b flex items-center gap-4">
                                        <div className="text-5xl font-medium text-gray-950">
                                            $35
                                        </div>
                                        <div className="text-sm/5 text-gray-950/75">
                                            <p>USD</p>
                                            <p>per month</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex-1 text-sm/6 text-gray-500">
                                        {excerpt}
                                    </div>

                                    <div className="mt-6 flex items-center gap-3">
                                        <Button className="text-sm/5">
                                            <Plus />
                                            Add to toolbox
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>

        {/* Items */}
        <div className="relative py-24 ">
            <Container>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {items.map(({ slug, item_script, created_at, excerpt, name }) => (
                        <div key={slug} className="relative flex flex-col rounded-3xl bg-white p-2 shadow-md ring-1 shadow-black/5 ring-black/5">
                            {item_script.image && (
                                <img
                                    src={item_script.image}
                                    className="aspect-3/2 w-full rounded-2xl object-cover"
                                />
                            )}
                            <div className="flex flex-1 flex-col p-8">
                                <div className="text-sm/5 text-gray-700">
                                    {dayjs(created_at).format('dddd, MMMM D, YYYY')}
                                </div>
                                <div className="mt-2 text-base/7 font-medium">
                                    <Link to={`./${slug}`}>
                                        <span className="absolute inset-0" />
                                        {name}
                                    </Link>
                                </div>

                                <div className="mt-4 pb-4 border-b flex items-center gap-4">
                                    <div className="text-5xl font-medium text-gray-950">
                                        $35
                                    </div>
                                    <div className="text-sm/5 text-gray-950/75">
                                        <p>USD</p>
                                        <p>per month</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex-1 text-sm/6 text-gray-500">
                                    {excerpt}
                                </div>

                                <div className="mt-6 flex items-center gap-3">
                                    <Button className="text-sm/5">
                                        <Plus />
                                        Add to toolbox
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>


        {/* Testemonials */}
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

    </Fragment>
)