import { CheckIcon, ChevronRightIcon, ChevronsUpDown, RssIcon } from 'lucide-react'
import { data, Link } from 'react-router'
import { Container } from '~/components/v3/container'
import { Button } from '~/components/v3/core/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '~/components/v3/core/dropdown'
import { Heading, Lead, Subheading } from '~/components/v3/core/typography'
import type { Route } from './+types/blog._index'
import dayjs from 'dayjs'
import { Fragment } from 'react/jsx-runtime'

// export async function GET(req: Request) {
//   let siteUrl = new URL(req.url).origin

//   let feed = new Feed({
//     title: 'The Radiant Blog',
//     description:
//       'Stay informed with product updates, company news, and insights on how to sell smarter at your company.',
//     author: {
//       name: 'Michael Foster',
//       email: 'michael.foster@example.com',
//     },
//     id: siteUrl,
//     link: siteUrl,
//     image: `${siteUrl}/favicon.ico`,
//     favicon: `${siteUrl}/favicon.ico`,
//     copyright: `All rights reserved ${new Date().getFullYear()}`,
//     feedLinks: {
//       rss2: `${siteUrl}/feed.xml`,
//     },
//   })

//   let { data: posts } = await getPostsForFeed()

//   posts.forEach((post) => {
//     try {
//       assert(typeof post.title === 'string')
//       assert(typeof post.slug === 'string')
//       assert(typeof post.excerpt === 'string')
//       assert(typeof post.publishedAt === 'string')
//     } catch (error) {
//       console.log('Post is missing required fields for RSS feed:', post, error)
//       return
//     }

//     feed.addItem({
//       title: post.title,
//       id: post.slug,
//       link: `${siteUrl}/blog/${post.slug}`,
//       content: post.excerpt,
//       image: post.mainImage
//         ? image(post.mainImage)
//             .size(1200, 800)
//             .format('jpg')
//             .url()
//             .replaceAll('&', '&amp;')
//         : undefined,
//       author: post.author?.name ? [{ name: post.author.name }] : [],
//       contributor: post.author?.name ? [{ name: post.author.name }] : [],
//       date: new Date(post.publishedAt),
//     })
//   })

//   return new Response(feed.rss2(), {
//     status: 200,
//     headers: {
//       'content-type': 'application/xml',
//       'cache-control': 's-maxage=31556952',
//     },
//   })
// }


export const loader = () => {
    const featured = [
        {
            title: 'This is a blog title',
            slug: 'test-0',
            image: 'https://cdn.sanity.io/images/ssqh4ksj/production/c734dd394de943820a25b4b96eace0855ab44749-2016x1344.png?w=1170&h=780&auto=format',
            excerpt: "Most people don't feel comfortable creating content that draws comparisons between desperate poverty and business practices but we think there's a silver lining to every humanitarian crisis. ",
            author: {
                image: 'https://cdn.sanity.io/images/ssqh4ksj/production/cd1ee59e9e4c2ff30c303de6c7d1066c057419d5-7952x5304.jpg?rect=2370,0,5304,5304&w=64&h=64&auto=format',
                name: 'Seaszn'
            },
            published_at: new Date()
        },
        {
            title: 'This is a blog title',
            image: 'https://cdn.sanity.io/images/ssqh4ksj/production/c734dd394de943820a25b4b96eace0855ab44749-2016x1344.png?w=1170&h=780&auto=format',
            excerpt: "Most people don't feel comfortable creating content that draws comparisons between desperate poverty and business practices but we think there's a silver lining to every humanitarian crisis. ",
            slug: 'test-1',
            author: {
                image: 'https://cdn.sanity.io/images/ssqh4ksj/production/cd1ee59e9e4c2ff30c303de6c7d1066c057419d5-7952x5304.jpg?rect=2370,0,5304,5304&w=64&h=64&auto=format',
                name: 'Seaszn'
            },
            published_at: new Date()
        },
        {
            title: 'This is a blog title',
            image: 'https://cdn.sanity.io/images/ssqh4ksj/production/c734dd394de943820a25b4b96eace0855ab44749-2016x1344.png?w=1170&h=780&auto=format',
            excerpt: "Most people don't feel comfortable creating content that draws comparisons between desperate poverty and business practices but we think there's a silver lining to every humanitarian crisis. ",
            slug: 'test-2',
            author: {
                image: 'https://cdn.sanity.io/images/ssqh4ksj/production/cd1ee59e9e4c2ff30c303de6c7d1066c057419d5-7952x5304.jpg?rect=2370,0,5304,5304&w=64&h=64&auto=format',
                name: 'Seaszn'
            },
            published_at: new Date()
        }
    ]

    const feed = [
        {
            title: 'This is a blog title',
            slug: 'test-0',
            excerpt: "Most people don't feel comfortable creating content that draws comparisons between desperate poverty and business practices but we think there's a silver lining to every humanitarian crisis. ",
            author: {
                image: 'https://cdn.sanity.io/images/ssqh4ksj/production/cd1ee59e9e4c2ff30c303de6c7d1066c057419d5-7952x5304.jpg?rect=2370,0,5304,5304&w=64&h=64&auto=format',
                name: 'Seaszn'
            },
            published_at: new Date()
        },
        {
            title: 'This is a blog title',
            excerpt: "Most people don't feel comfortable creating content that draws comparisons between desperate poverty and business practices but we think there's a silver lining to every humanitarian crisis. ",
            slug: 'test-1',
            author: {
                image: 'https://cdn.sanity.io/images/ssqh4ksj/production/cd1ee59e9e4c2ff30c303de6c7d1066c057419d5-7952x5304.jpg?rect=2370,0,5304,5304&w=64&h=64&auto=format',
                name: 'Seaszn'
            },
            published_at: new Date()
        },
        {
            title: 'This is a blog title',
            excerpt: "Most people don't feel comfortable creating content that draws comparisons between desperate poverty and business practices but we think there's a silver lining to every humanitarian crisis. ",
            slug: 'test-2',
            author: {
                image: 'https://cdn.sanity.io/images/ssqh4ksj/production/cd1ee59e9e4c2ff30c303de6c7d1066c057419d5-7952x5304.jpg?rect=2370,0,5304,5304&w=64&h=64&auto=format',
                name: 'Seaszn'
            },
            published_at: new Date()
        }
    ]

    return data({ feed, featured })
}

export default ({ loaderData: { feed, featured } }: Route.ComponentProps) => {
    return (
        <Fragment>
            {/* Title */}
            <Container>
                <Subheading className="mt-16">Blog</Subheading>
                <Heading size="h1" className="mt-2">
                    What’s happening at BosWaves.
                </Heading>
                <Lead className="mt-6 max-w-3xl">
                    Stay informed with product updates, company news, and insights on how
                    to sell smarter at your company.
                </Lead>
            </Container>

            {/* Featured */}
            <div className="mt-16 bg-linear-to-t from-gray-100 pb-14">
                <Container>
                    <h2 className="text-2xl font-medium tracking-tight">Featured</h2>
                    <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {featured.map(({ slug, title, excerpt, image, author, published_at }) => (
                            <div
                                key={slug}
                                className="relative flex flex-col rounded-3xl bg-white p-2 shadow-md ring-1 shadow-black/5 ring-black/5"
                            >
                                {image && (
                                    <img
                                        src={image}
                                        className="aspect-3/2 w-full rounded-2xl object-cover"
                                    />
                                )}
                                <div className="flex flex-1 flex-col p-8">
                                    <div className="text-sm/5 text-gray-700">
                                        {dayjs(published_at).format('dddd, MMMM D, YYYY')}
                                    </div>
                                    <div className="mt-2 text-base/7 font-medium">
                                        <Link to={`/blog/${slug}`}>
                                            <span className="absolute inset-0" />
                                            {title}
                                        </Link>
                                    </div>
                                    <div className="mt-2 flex-1 text-sm/6 text-gray-500">
                                        {excerpt}
                                    </div>
                                    {author && (
                                        <div className="mt-6 flex items-center gap-3">
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
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>

            {/* Categories */}
            <Container className="mt-16 pb-24">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <div className='flex items-center justify-between gap-2 font-medium'>
                                All categories
                                <ChevronsUpDown className="size-4 text-gray-900" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent sideOffset={6} alignOffset={-4} className="min-w-40 rounded-lg bg-white p-1 shadow-lg ring-1 ring-gray-200" align="start" side='bottom'>
                            <DropdownMenuItem asChild className='group rounded-md hover:bg-gray-950/5'>
                                <Link to={'/blog'}>
                                    <CheckIcon />
                                    <p className="col-start-2 text-sm/6">All categories</p>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link to="/blog/feed.xml">
                        <Button variant="outline" className="gap-1">
                            <RssIcon className="size-4" />
                            RSS Feed
                        </Button>
                    </Link>
                </div>

                {/* Posts */}
                <div className="mt-6">
                    {feed.map(({ slug, title, excerpt, author, published_at }) => (
                        <Link to={`/blog/${slug}`} key={slug} className="relative grid grid-cols-1 border-b border-b-gray-100 py-10 first:border-t first:border-t-gray-200 max-sm:gap-3 sm:grid-cols-3">
                            <div>
                                <div className="text-sm/5 max-sm:text-gray-700 sm:font-medium">
                                    {dayjs(published_at).format('dddd, MMMM D, YYYY')}
                                </div>
                                {author && (
                                    <div className="mt-2.5 flex items-center gap-3">
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
                            </div>
                            <div className="sm:col-span-2 sm:max-w-2xl">
                                <h2 className="text-sm/5 font-medium">{title}</h2>
                                <p className="mt-3 text-sm/6 text-gray-500">{excerpt}</p>
                                <div className="mt-4">
                                    <div className="flex items-center gap-1 text-sm/5 font-medium">
                                        Read more
                                        <ChevronRightIcon className="size-4 fill-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>


                {/* <Pagination page={page} category={category} /> */}
            </Container>
        </Fragment>
    )
}