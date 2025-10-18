import type { Route } from "./+types/_store.library._index";
import { Form, Link, useSearchParams } from "react-router";
import { Checkbox } from "~/components/core/checkbox";
import { Popover, PopoverButton, PopoverPanel } from "~/components/core/popover";
import { Menu, MenuItem, MenuItems, MenuButton } from "~/components/core/menu";
import { ChevronDown } from 'lucide-react'
import Heading from "~/components/core/heading";
import Paragraph from "~/components/core/paragraph";
import Label from "~/components/core/label";
import ProductList from "~/components/sections/product/list";

import Button from "~/components/core/button";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({ }: Route.LoaderArgs) {
  console.log('test')

  return {}
}

const products = [
  {
    id: 'Trend Pivots Profile',
    name: 'Trend Pivots Profile',
    description: "trading indicator is a powerful tool designed to automatically detect and highlight filled and unfilled price gaps between regular trading sessions. It helps traders visually identify areas of strong market sentiment changes and provides a comprehensive dashboard showing detailed statistics about gap behavior and probabilities. Whether you're a day trader or swing trader, this indicator can help you understand how price gaps influence market direction and momentum.",
    price: '$25',
    imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
    imageAlt: 'image'
  },
  {
    id: 'Trend Pivots Profile',
    name: 'Trend Pivots Profile',
    description: "trading indicator is a powerful tool designed to automatically detect and highlight filled and unfilled price gaps between regular trading sessions. It helps traders visually identify areas of strong market sentiment changes and provides a comprehensive dashboard showing detailed statistics about gap behavior and probabilities. Whether you're a day trader or swing trader, this indicator can help you understand how price gaps influence market direction and momentum.",
    price: '$25',
    imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
    imageAlt: 'image'
  },
  {
    id: 'Trend Pivots Profile',
    name: 'Trend Pivots Profile',
    description: "trading indicator is a powerful tool designed to automatically detect and highlight filled and unfilled price gaps between regular trading sessions. It helps traders visually identify areas of strong market sentiment changes and provides a comprehensive dashboard showing detailed statistics about gap behavior and probabilities. Whether you're a day trader or swing trader, this indicator can help you understand how price gaps influence market direction and momentum.",
    price: '$25',
    imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
    imageAlt: 'image'
  },
  {
    id: 'Trend Pivots Profile',
    name: 'Trend Pivots Profile',
    description: "trading indicator is a powerful tool designed to automatically detect and highlight filled and unfilled price gaps between regular trading sessions. It helps traders visually identify areas of strong market sentiment changes and provides a comprehensive dashboard showing detailed statistics about gap behavior and probabilities. Whether you're a day trader or swing trader, this indicator can help you understand how price gaps influence market direction and momentum.",
    price: '$25',
    imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
    imageAlt: 'image'
  },
  {
    id: 'Trend Pivots Profile',
    name: 'Trend Pivots Profile',
    description: "trading indicator is a powerful tool designed to automatically detect and highlight filled and unfilled price gaps between regular trading sessions. It helps traders visually identify areas of strong market sentiment changes and provides a comprehensive dashboard showing detailed statistics about gap behavior and probabilities. Whether you're a day trader or swing trader, this indicator can help you understand how price gaps influence market direction and momentum.",
    price: '$25',
    imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
    imageAlt: 'image'
  },
  {
    id: 'Trend Pivots Profile',
    name: 'Trend Pivots Profile',
    description: "trading indicator is a powerful tool designed to automatically detect and highlight filled and unfilled price gaps between regular trading sessions. It helps traders visually identify areas of strong market sentiment changes and provides a comprehensive dashboard showing detailed statistics about gap behavior and probabilities. Whether you're a day trader or swing trader, this indicator can help you understand how price gaps influence market direction and momentum.",
    price: '$25',
    imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
    imageAlt: 'image'
  }
]

export default function renderer() {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <div className="">

      {/* toolbar */}
      <div className="px-4 sm:px-6 lg:px-8 sm:max-w-7xl max-w-[40rem] mx-auto">
        <div className="py-24">
          <Heading size="h1">
            New Arrivals
          </Heading>
          <Paragraph className="mt-4 max-w-3xl">
            Our thoughtfully designed workspace objects are crafted in limited runs. Improve your productivity and organization with these sale items before we run out.
          </Paragraph>
        </div>
        <section aria-labelledby="filter-heading" className="py-6 px-4 sm:px-0 border-gray-200 dark:border-y-gray-700 border-t">
          <h2 id="filter-heading" className="sr-only">Product filters</h2>
          <div className="justify-between items-center flex">
            <Menu>
              <MenuButton >
                <Paragraph size="sm" className="mr-1">
                  Sort
                </Paragraph>
                <ChevronDown className="size-4" />
              </MenuButton>
              <MenuItems anchor="bottom start">
                <MenuItem to={'/settings'}>
                  Most Popuplar
                </MenuItem>
                <MenuItem to={'/settings'}>
                  Best Rating
                </MenuItem>
                <MenuItem to={'/settings'}>
                  Newest
                </MenuItem>
              </MenuItems>
            </Menu>

            <button className="text-gray-700 dark:text-gray-400 font-medium text-sm/5 inline-block sm:hidden">
              Filter
            </button>

            <div className="hidden sm:flex ">
              <Popover className={'sm:not-last:mr-8'}>
                <PopoverButton>
                  <Paragraph size="sm" className="mr-1">
                    Category
                  </Paragraph>
                  <ChevronDown className="size-4" />
                </PopoverButton>
                <PopoverPanel>
                  <Form  >
                    <div className="gap-3 flex h-5 not-last:mb-4 items-center">
                      <Checkbox id='trees' name="category" value="tees" />
                      <Label>
                        Tees
                      </Label>
                    </div>
                    <div className="gap-3 flex h-5 not-last:mb-4 items-center">
                      <Checkbox />
                      <Label>
                        Crewnecks
                      </Label>
                    </div>
                    <div className="gap-3 flex h-5 not-last:mb-4 items-center">
                      <Checkbox />
                      <Label>
                        Hats
                      </Label>
                    </div>
                  </Form>
                </PopoverPanel>
              </Popover>

              <Popover className={'sm:not-last:mr-8'}>
                <PopoverButton>
                  <Paragraph size="sm" className="mr-1">
                    Type
                  </Paragraph>
                  <ChevronDown className="size-4" />
                </PopoverButton>
                <PopoverPanel>
                  <Form  >
                    <div className="gap-3 flex h-5 not-last:mb-4 items-center">
                      <Checkbox id='trees' name="category" value="tees" />
                      <Label>
                        Tees
                      </Label>
                    </div>
                    <div className="gap-3 flex h-5 not-last:mb-4 items-center">
                      <Checkbox />
                      <Label>
                        Crewnecks
                      </Label>
                    </div>
                    <div className="gap-3 flex h-5 not-last:mb-4 items-center">
                      <Checkbox />
                      <Label>
                        Hats
                      </Label>
                    </div>
                  </Form>
                </PopoverPanel>
              </Popover>

            </div>
          </div>
        </section>
        <div className={"grid grid-cols-1 gap-x-6 gap-y-10 py-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"}>
          {products.slice(0, 10).map((product) => (
            <div key={product.id} className="ring-1 group ring-gray-900/10 shadow-xl bg-gray-900/5 dark:bg-white/5 dark:ring-white/10 rounded-lg overflow-hidden">
              <Link to={`/library/${product.id}`} className=" peer">
                <img
                  alt={product.imageAlt}
                  src={product.imageSrc}
                  className="aspect-square peer w-full bg-gray-200 dark:bg-gray-800 object-cover xl:aspect-[8/7]"
                />
              </Link>
              <Link to={`/library/${product.id}`} className="transition-opacity px-4 pt-4 block hover:opacity-75 peer-hover:opacity-75">
                <div className="flex w-full justify-between">
                  <div>
                    <Heading size="h5" className="">
                      {product.name}
                    </Heading>
                    <Paragraph size="sm" className="">
                      Indicator
                    </Paragraph>
                  </div>

                  <Paragraph size="lg" className="font-medium dark:text-white text-gray-900">
                    {product.price}
                  </Paragraph>
                </div>
                <Paragraph size="sm" className="mt-4 line-clamp-4">
                  {product.description}
                </Paragraph>
              </Link>
              <div className="block p-4 w-fit">
                <Link to={`/library/${product.id}`} className="w-fit">
                  <Button className="">
                    Get Access
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProductList />
      {/* <ProductList /> */}
    </div>
  )
}
