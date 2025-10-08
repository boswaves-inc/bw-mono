import type { Route } from "./+types/products._index";
import { createSearchParams, Form, Link, useFetcher, useSearchParams } from "react-router";
import { Checkbox } from "~/components/core/checkbox";
import { Popover, PopoverButton, PopoverPanel } from "~/components/core/popover";
import { Menu, MenuItem, MenuItems, MenuButton } from "~/components/core/menu";
import { ChevronDown } from 'lucide-react'
import Heading from "~/components/core/heading";
import Paragraph from "~/components/core/paragraph";
import Label from "~/components/core/label";
import ProductList from "~/components/sections/product/list";

const products = [
  {
    id: 'test',
    name: 'test',
    price: '$25',
    imageSrc: 'image.url',
    imageAlt: 'image'
  },
  {
    id: 'test',
    name: 'test',
    price: '$25',
    imageSrc: 'image.url',
    imageAlt: 'image'
  },
  {
    id: 'test',
    name: 'test',
    price: '$25',
    imageSrc: 'image.url',
    imageAlt: 'image'
  },
  {
    id: 'test',
    name: 'Test',
    price: '$25',
    imageSrc: 'image.url',
    imageAlt: 'image'
  },
  {
    id: 'Test',
    name: 'test',
    price: '$25',
    imageSrc: 'image.url',
    imageAlt: 'image'
  },
  {
    id: 'test',
    name: 'test',
    price: '$25',
    imageSrc: 'image.url',
    imageAlt: 'image'
  },
  {
    id: 'test',
    name: 'test',
    price: '$25',
    imageSrc: 'image.url',
    imageAlt: 'image'
  },
  {
    id: 'test',
    name: 'Test',
    price: '$25',
    imageSrc: 'image.url',
    imageAlt: 'image'
  },
]

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

export default function renderer() {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <div className="">

      {/* toolbar */}
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="text-center px-4 sm:px-6 lg:px-8 lg:max-w-7xl max-w-[40rem] mx-auto">
          <div className="py-24">
            <Heading size="h1">
              New Arrivals
            </Heading>
            <Paragraph className="mt-4 mx-auto max-w-3xl">
              Thoughtfully designed indicators for your strategies
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
        </div>
      </div>

      <ProductList heading="Others also use"/>
      <ProductList />
    </div>
  )
}
