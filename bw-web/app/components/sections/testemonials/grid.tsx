import { forwardRef } from "react";
import Heading from "~/components/core/heading";
import type { SectionProps } from "~/components/core/section";
import Section from "~/components/core/section";

const TestemonialsGrid = forwardRef<HTMLElement, SectionProps>((props, ref) => {
    return (
        <Section ref={ref}>

            <div className="overflow-hidden top-0 -ml-[22rem] opacity-25 absolute flex blur-3xl">
                <div style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }} className="from-[#ff80b5] to-[#9089fc] rotate-[30deg] bg-gradient-to-tr aspect-[1313/771] origin-right w-7xl"></div>
            </div>

            <div className=" blur-3xl overflow-hidden translate-z-0 -translate-y-1/2 opacity-30 top-1/2 inset-x-0 absolute">
                <div style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }} className="from-[#ff80b5] to-[#9089fc] bg-gradient-to-tr ml-[max(50%,28rem)] aspect-[1313/771] w-7xl"></div>
            </div>

            <div className="max-w-2xl text-center z-10 mx-auto">
                <Heading size="h4">Testimonials</Heading>
                <Heading size="h1" className="mt-2">We have worked with thousands of amazing people</Heading>
            </div>
            <div className="sm:grid-cols-2 xl:grid-cols-4 xl:grid-flow-col xl:max-w-none z-10 sm:mt-20 text-gray-900 text-sm/6 gap-8 grid-cols-1 grid-rows-1 max-w-2xl grid mt-16 mx-auto">
                <figure className="sm:col-span-2 xl:row-end-1 xl:col-start-2 dark:ring-white/10 ring-gray-900/10 ring-1 rounded-2xl z-10 bg-white dark:bg-gray-800 shadow-lg">
                    <blockquote className=" sm:text-xl text-lg p-6 sm:p-12 text-gray-900 dark:text-white tracking-tight font-semibold">
                        <p>
                            “Integer id nunc sit semper purus. Bibendum at lacus ut arcu blandit montes vitae auctor libero. Hac condimentum dignissim nibh vulputate ut nunc. Amet nibh orci mi venenatis blandit vel et proin. Non hendrerit in vel ac diam.”
                        </p>
                    </blockquote>
                    <figcaption className="sm:flex-nowrap py-4 px-6 border-gray-900/10 dark:border-white/10 border-t gap-y-4 gap-x-4 items-center flex-wrap flex">
                        <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80" className="size-10 rounded-full ring-1 ring-gray-900/5" />
                        <div className="flex-auto text-gray-900 dark:text-white text-sm/6">
                            <div className=" font-medium">Brenna Goyette</div>
                            <div className="text-gray-600 dark:text-gray-400">@brennagoyette</div>
                        </div>
                    </figcaption>
                </figure>
                <div className="xl:contents">
                    <div className="xl:row-span-2 not-last-of-type:mb-8 xl:not-last-of-type:mb-0">
                        <figure className="p-6 dark:ring-white/10 ring-gray-900/10 dark:bg-gray-800 bg-white ring-1 not-last-of-type:mb-10 rounded-2xl relative z-10 shadow-lg" >
                            <blockquote className="text-gray-900 dark:text-white">
                                <p>
                                    “Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.”
                                </p>
                            </blockquote>
                            <figcaption className="sm:flex-nowrap mt-6 gap-y-4 gap-x-4 items-center flex-wrap flex">
                                <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80" className="size-10 rounded-full ring-1 ring-gray-900/5" />
                                <div className="flex-auto text-gray-900 dark:text-white text-sm/6">
                                    <div className=" font-medium">Brenna Goyette</div>
                                    <div className="text-gray-600 dark:text-gray-400">@brennagoyette</div>
                                </div>
                            </figcaption>
                        </figure>
                        <figure className="p-6 dark:ring-white/10 ring-gray-900/10 dark:bg-gray-800 bg-white ring-1 not-last-of-type:mb-10 rounded-2xl relative z-10 shadow-lg" >
                            <blockquote className="text-gray-900 dark:text-white">
                                <p>
                                    “Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.”
                                </p>
                            </blockquote>
                            <figcaption className="sm:flex-nowrap mt-6 gap-y-4 gap-x-4 items-center flex-wrap flex">
                                <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80" className="size-10 rounded-full ring-1 ring-gray-900/5" />
                                <div className="flex-auto text-gray-900 dark:text-white text-sm/6">
                                    <div className=" font-medium">Brenna Goyette</div>
                                    <div className="text-gray-600 dark:text-gray-400">@brennagoyette</div>
                                </div>
                            </figcaption>
                        </figure>
                    </div>
                    <div className="xl:row-start-1 not-last-of-type:mb-8 xl:not-last-of-type:mb-0">
                        <figure className="p-6 dark:ring-white/10 ring-gray-900/10 dark:bg-gray-800 bg-white ring-1 not-last-of-type:mb-10 rounded-2xl relative z-10 shadow-lg" >
                            <blockquote className="text-gray-900 dark:text-white">
                                <p>
                                    “Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.”
                                </p>
                            </blockquote>
                            <figcaption className="sm:flex-nowrap mt-6 gap-y-4 gap-x-4 items-center flex-wrap flex">
                                <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80" className="size-10 rounded-full ring-1 ring-gray-900/5" />
                                <div className="flex-auto text-gray-900 dark:text-white text-sm/6">
                                    <div className=" font-medium">Brenna Goyette</div>
                                    <div className="text-gray-600 dark:text-gray-400">@brennagoyette</div>
                                </div>
                            </figcaption>
                        </figure>
                    </div>
                </div>
                <div className="xl:contents">
                    <div className="xl:row-start-1 not-last-of-type:mb-8 xl:not-last-of-type:mb-0">
                        <figure className="p-6 dark:ring-white/10 ring-gray-900/10 dark:bg-gray-800 bg-white ring-1 not-last-of-type:mb-10 rounded-2xl relative z-10 shadow-lg" >
                            <blockquote className="text-gray-900 dark:text-white">
                                <p>
                                    “Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.”
                                </p>
                            </blockquote>
                            <figcaption className="sm:flex-nowrap mt-6 gap-y-4 gap-x-4 items-center flex-wrap flex">
                                <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80" className="size-10 rounded-full ring-1 ring-gray-900/5" />
                                <div className="flex-auto text-gray-900 dark:text-white text-sm/6">
                                    <div className=" font-medium">Brenna Goyette</div>
                                    <div className="text-gray-600 dark:text-gray-400">@brennagoyette</div>
                                </div>
                            </figcaption>
                        </figure>
                    </div>
                    <div className="xl:row-span-2 not-last-of-type:mb-8 xl:not-last-of-type:mb-0">
                        <figure className="p-6 dark:ring-white/10 ring-gray-900/10 dark:bg-gray-800 bg-white ring-1 not-last-of-type:mb-10 rounded-2xl relative z-10 shadow-lg" >
                            <blockquote className="text-gray-900 dark:text-white">
                                <p>
                                    “Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.”
                                </p>
                            </blockquote>
                            <figcaption className="sm:flex-nowrap mt-6 gap-y-4 gap-x-4 items-center flex-wrap flex">
                                <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80" className="size-10 rounded-full ring-1 ring-gray-900/5" />
                                <div className="flex-auto text-gray-900 dark:text-white text-sm/6">
                                    <div className=" font-medium">Brenna Goyette</div>
                                    <div className="text-gray-600 dark:text-gray-400">@brennagoyette</div>
                                </div>
                            </figcaption>
                        </figure>
                        <figure className="p-6 dark:ring-white/10 ring-gray-900/10 dark:bg-gray-800 bg-white ring-1 not-last-of-type:mb-10 rounded-2xl relative z-10 shadow-lg" >
                            <blockquote className="text-gray-900 dark:text-white">
                                <p>
                                    “Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.”
                                </p>
                            </blockquote>
                            <figcaption className="sm:flex-nowrap mt-6 gap-y-4 gap-x-4 items-center flex-wrap flex">
                                <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80" className="size-10 rounded-full ring-1 ring-gray-900/5" />
                                <div className="flex-auto text-gray-900 dark:text-white text-sm/6">
                                    <div className=" font-medium">Brenna Goyette</div>
                                    <div className="text-gray-600 dark:text-gray-400">@brennagoyette</div>
                                </div>
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </div>
        </Section>
    )
})

export default TestemonialsGrid;