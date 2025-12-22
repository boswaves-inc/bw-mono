// import { image } from '@/sanity/image'
// import { getPostsForFeed } from '@/sanity/queries'

import { Menu, MenuButton, MenuItem } from '@headlessui/react'
import { CheckIcon, ChevronRightIcon, ChevronsUpDown, RssIcon } from 'lucide-react'
import { data, Link, Outlet } from 'react-router'
import { MenuItems } from '~/components/core/menu'
import { Container } from '~/components/v3/container'
import { Button } from '~/components/v3/core/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '~/components/v3/core/dropdown'
import { Heading, Lead, Subheading } from '~/components/v3/core/typography'
import { Footer } from '~/components/v3/footer'
import { GradientBackground } from '~/components/v3/gradient'
import { Navigation } from '~/components/v3/navbar'
import type { Route } from './+types/blog'
import dayjs from 'dayjs'

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


export default ({ loaderData }: Route.ComponentProps) => {
    return (
        <main className="overflow-hidden bg-gray-50">
            <GradientBackground />
            <Container>
                <Navigation>
                    <Link to={'/blog/radiant-raises-100m-series-a-from-tailwind-ventures'} className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium text-white data-hover:bg-fuchsia-950/30">
                        Radiant raises $100M Series A from Tailwind Ventures
                        <ChevronRightIcon className="size-4" />
                    </Link>
                </Navigation>
            </Container>
            <Outlet />
            <Footer />
        </main>
    )
}