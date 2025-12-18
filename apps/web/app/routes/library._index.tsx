import { data, Form, Link, useSearchParams } from "react-router";
import { Checkbox } from "~/components/core/v2/checkbox";
import { Popover, PopoverButton, PopoverPanel } from "~/components/core/popover";
import { Menu, MenuItem, MenuItems, MenuButton } from "~/components/core/menu";
import { CheckIcon, ChevronDown, PlusIcon } from 'lucide-react'
import Paragraph from "~/components/core/paragraph";
import Label from "~/components/core/label";

import { Item, ItemScript, ItemPrice, ScriptType, Status, PeriodUnit, Script } from "@bw/core";
import _ from 'lodash'
import type { Route } from "./+types/library._index";
import { useCart } from "~/context/cart";
import { and, eq, getTableColumns, isNotNull, sql } from "drizzle-orm";
import { array_agg, coalesce, json_agg_object } from "@bw/core/utils/drizzle.ts";
import { formatCurrency } from "@coingecko/cryptoformat";
import { Button } from "~/components/core/v2/button";
import { Heading } from "~/components/core/v2/typography";
import Page from "~/components/page";
import Section from "~/components/section";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context: { postgres, geo } }: Route.LoaderArgs) {
  const period_unit: PeriodUnit = 'month'

  const result = await postgres.select({
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

  return data({ data: result })
}

export default function renderer({ loaderData }: Route.ComponentProps) {
  const cart = useCart()

  return (
    <Page>
      <Section>
        <div>
          <Heading size="h1">
            Your Trading Toolbox Starts Here
          </Heading>
          <Paragraph className="mt-4 max-w-3xl">
            {/* Our thoughtfully designed workspace objects are crafted in limited runs. Improve your productivity and organization with these sale items before we run out. */}
            Mix, match, and master - customize your indicator setup to perfection.
          </Paragraph>
        </div>
        <div className="border-t pt-6 mt-18">
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

            <div className="hidden sm:flex sm:gap-x-8 ">
              <Popover className={''}>
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

              <Popover className={''}>
                <PopoverButton>
                  <Paragraph size="sm" className="mr-1">
                    Type
                  </Paragraph>
                  <ChevronDown className="size-4" />
                </PopoverButton>
                <PopoverPanel>
                  <Form  >
                    {ScriptType.enumValues.map(x => (
                      <div className="gap-3 flex h-5 not-last:mb-4 items-center">
                        <Checkbox id={x} name="type" value={x} />
                        <Label>
                          {_.startCase(x)}
                        </Label>
                      </div>
                    ))}
                  </Form>
                </PopoverPanel>
              </Popover>

            </div>
          </div>
        </div>

        <div className={"grid grid-cols-1 gap-x-6 gap-y-10 py-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"}>
          {loaderData.data.slice(0, 10).map((item) => (
            <div key={item.slug} className="ring-1 group ring-gray-900/10 shadow-xl bg-gray-900/5 dark:bg-white/5 dark:ring-white/10 rounded-lg overflow-hidden">
              <Link to={`/library/${item.slug}`} className=" peer">
                <img
                  alt={item.slug}
                  src={item.item_script.image}
                  className="aspect-square peer w-full bg-gray-200 dark:bg-gray-800 object-cover xl:aspect-8/7"
                />
              </Link>
              <Link to={`/library/${item.slug}`} className="transition-opacity px-4 pt-4 block hover:opacity-75 peer-hover:opacity-75">
                <div className="flex w-full justify-between">
                  <div>
                    <Heading size="h5" className="">
                      {item.name}
                    </Heading>
                    <Paragraph size="sm" className="">
                      {_.startCase(item.item_script.type)}
                    </Paragraph>
                  </div>

                  <Paragraph size="lg" className="font-medium dark:text-white text-gray-900">
                    {formatCurrency(item.item_price.price / 100, item.item_price.currency_code, 'US-en')}
                  </Paragraph>
                </div>
                <Paragraph size="sm" className="mt-4 line-clamp-4">
                  {item.description}
                </Paragraph>
              </Link>
              <div className="block p-4 w-fit">
                {/* <Link to={`./${item.slug}`}> */}
                <Button data-selected={cart.includes(item.item_price.id)} className="group/button">
                  <div className="relative">
                    <PlusIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-200 group-data-[selected=true]/button:scale-0 group-data-[selected=true]/button:-rotate-90" />
                    <CheckIcon className="absolute h-[1.2rem] inset-0 w-[1.2rem] rotate-90 scale-0 transition-all duration-200 group-data-[selected=true]/button:scale-100 group-data-[selected=true]/button:rotate-0" />
                  </div>
                  Added to toolbox
                </Button>
                {/* </Link> */}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  )
}
