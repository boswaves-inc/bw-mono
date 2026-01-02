import { data, Link } from "react-router"
import { Fragment } from "react/jsx-runtime"
import type { Route } from "./+types/blog.$slug"
import { Heading, Subheading } from "~/components/v3/core/typography"
import { Container } from "~/components/v3/container"
import dayjs from "dayjs"
import { Button } from "~/components/v3/core/button"
import { ChevronLeftIcon } from "lucide-react"
import { Markdown } from "~/components/v3/core/markdown"

const url = "https://gist.githubusercontent.com/allysonsilva/85fff14a22bbdf55485be947566cc09e/raw/fa8048a906ebed3c445d08b20c9173afd1b4a1e5/Full-Markdown.md"

export const loader = async () => {
    const body = await fetch(url).then(x => x.text());

    return data({
        body,
        title: 'This is a blog title',
        image: 'https://cdn.sanity.io/images/ssqh4ksj/production/c734dd394de943820a25b4b96eace0855ab44749-2016x1344.png?w=1170&h=780&auto=format',
        author: {
            image: 'https://cdn.sanity.io/images/ssqh4ksj/production/cd1ee59e9e4c2ff30c303de6c7d1066c057419d5-7952x5304.jpg?rect=2370,0,5304,5304&w=64&h=64&auto=format',
            name: 'Seaszn Libertas'
        },
        categories: [{
            title: "Insights",
            slug: 'insights'
        }],
        published_at: new Date()
    })
}

export default ({ loaderData }: Route.ComponentProps) => {
    const { title, body, image, published_at, author, categories } = loaderData;

    return (
        <Fragment>

            {/* Title */}
            <Container>
                <Subheading className="mt-16">
                    {dayjs(published_at).format('dddd, MMMM D, YYYY')}
                </Subheading>
                <Heading size="h1" className="mt-2">
                    {title}
                </Heading>
            </Container>

            {/* Content */}
            <Container className="mt-16">
                <div className="grid grid-cols-1 gap-8 pb-24 lg:grid-cols-[15rem_1fr] xl:grid-cols-[15rem_1fr_15rem]">
                    {/* Author */}
                    <div className="flex flex-wrap items-center gap-8 max-lg:justify-between lg:flex-col lg:items-start">
                        {author && (
                            <div className="flex items-center gap-3">
                                {author.image && (
                                    <img
                                        alt=""
                                        src={author.image}
                                        className="aspect-square size-6 rounded-full object-cover"
                                    />
                                )}
                                <div className="text-sm/5 text-gray-700">
                                    {author.name}
                                </div>
                            </div>
                        )}
                        {Array.isArray(categories) && (
                            <div className="flex flex-wrap gap-2">
                                {categories.map(({ slug, title }) => (
                                    <Link key={slug} to={`/blog?category=${slug}`} className="rounded-full border border-dotted border-gray-300 bg-gray-50 px-2 text-sm/6 font-medium text-gray-500">
                                        {title}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="text-gray-700">
                        <div className="max-w-2xl xl:mx-auto">
                            {image && (
                                <img
                                    src={image}
                                    className="mb-10 aspect-3/2 w-full rounded-2xl object-cover shadow-xl"
                                />
                            )}

                            <Markdown content={body} />
                            {/* {post.body && (
                                <PortableText
                                    value={post.body}
                                    components={{
                                        block: {
                                            normal: ({ children }) => (
                                                <p className="my-10 text-base/8 first:mt-0 last:mb-0">
                                                    {children}
                                                </p>
                                            ),
                                            h2: ({ children }) => (
                                                <h2 className="mt-12 mb-10 text-2xl/8 font-medium tracking-tight text-gray-950 first:mt-0 last:mb-0">
                                                    {children}
                                                </h2>
                                            ),
                                            h3: ({ children }) => (
                                                <h3 className="mt-12 mb-10 text-xl/8 font-medium tracking-tight text-gray-950 first:mt-0 last:mb-0">
                                                    {children}
                                                </h3>
                                            ),
                                            blockquote: ({ children }) => (
                                                <blockquote className="my-10 border-l-2 border-l-gray-300 pl-6 text-base/8 text-gray-950 first:mt-0 last:mb-0">
                                                    {children}
                                                </blockquote>
                                            ),
                                        },
                                        types: {
                                            image: ({ value }) => (
                                                <img
                                                    alt={value.alt || ''}
                                                    src={image(value).width(2000).url()}
                                                    className="w-full rounded-2xl"
                                                />
                                            ),
                                            separator: ({ value }) => {
                                                switch (value.style) {
                                                    case 'line':
                                                        return (
                                                            <hr className="my-8 border-t border-gray-200" />
                                                        )
                                                    case 'space':
                                                        return <div className="my-8" />
                                                    default:
                                                        return null
                                                }
                                            },
                                        },
                                        list: {
                                            bullet: ({ children }) => (
                                                <ul className="list-disc pl-4 text-base/8 marker:text-gray-400">
                                                    {children}
                                                </ul>
                                            ),
                                            number: ({ children }) => (
                                                <ol className="list-decimal pl-4 text-base/8 marker:text-gray-400">
                                                    {children}
                                                </ol>
                                            ),
                                        },
                                        listItem: {
                                            bullet: ({ children }) => {
                                                return (
                                                    <li className="my-2 pl-2 has-[br]:mb-8">
                                                        {children}
                                                    </li>
                                                )
                                            },
                                            number: ({ children }) => {
                                                return (
                                                    <li className="my-2 pl-2 has-[br]:mb-8">
                                                        {children}
                                                    </li>
                                                )
                                            },
                                        },
                                        marks: {
                                            strong: ({ children }) => (
                                                <strong className="font-semibold text-gray-950">
                                                    {children}
                                                </strong>
                                            ),
                                            code: ({ children }) => (
                                                <>
                                                    <span aria-hidden>`</span>
                                                    <code className="text-[15px]/8 font-semibold text-gray-950">
                                                        {children}
                                                    </code>
                                                    <span aria-hidden>`</span>
                                                </>
                                            ),
                                            link: ({ value, children }) => {
                                                return (
                                                    <Link
                                                        href={value.href}
                                                        className="font-medium text-gray-950 underline decoration-gray-400 underline-offset-4 data-hover:decoration-gray-600"
                                                    >
                                                        {children}
                                                    </Link>
                                                )
                                            },
                                        },
                                    }}
                                />
                            )}  */}
                            <div className="mt-10">
                                <Link to={'/blog'}>
                                    <Button variant="outline">
                                        <ChevronLeftIcon className="size-4" />
                                        Back to blog
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Fragment>
    )
}
