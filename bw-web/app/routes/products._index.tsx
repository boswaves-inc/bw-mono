import type { Route } from "./+types/products._index";
import { createSearchParams, Form, Link, useFetcher, useSearchParams } from "react-router";
import { Checkbox } from "~/components/core/checkbox";
import { Popover, PopoverButton, PopoverPanel } from "~/components/core/popover";
import { Menu, MenuItem, MenuItems, MenuButton } from "~/components/core/menu";
import { ChevronDown } from 'lucide-react'
import Heading from "~/components/core/heading";
import Paragraph from "~/components/core/paragraph";
import Label from "~/components/core/label";

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
      <div className="bg-gray-50 dark:bg-gray-800">
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
      {/* header */}
      {/* toolbar */}

      <div className="mx-auto max-w-2xl y-16 px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.slice(0, 1).map((product) => (
            <div key={product.id} className="group relative">
              <img
                alt={product.imageAlt}
                src={product.imageSrc}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
              />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm/5 text-gray-700">
                    <Link to={product.id}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm/5 text-gray-500">{product.name}</p>
                </div>
                <p className="text-sm/5 font-medium dark:text-white text-gray-900">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <Link key={product.id} to={product.id} className="group">
              <img
                alt={product.imageAlt}
                src={product.imageSrc}
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
              />
              <h3 className="mt-4 text-sm/5 text-gray-700">{product.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{product.price}</p>
            </Link>
          ))}
        </div>
      </div> */}
    </div>
  )
}
