import { ItemScript, PeriodUnit, ItemPrice, type Item, Script } from "@bw/core";
import { useOne } from "@refinedev/core";
import _ from "lodash";
import { data } from "react-router";
import { Badge } from "~/components/core/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/core/card";
import { Label } from "~/components/core/label";
import { Separator } from "~/components/core/separator";
import { Flag } from "~/components/flag";
import { ShowView, ShowViewHeader } from "~/components/refine/views/show";
import type { Route } from "./+types/plan.$id._index";

export const loader = async ({ context }: Route.LoaderArgs) => {
    const { list: currencies } = await context.chargebee.currency.list()

    return data({ currencies })
}

export default ({ loaderData, params }: Route.ComponentProps) => {
    // const { result: record } = useShow<Item & { item_script: ItemScript, item_price: ItemPrice[] }>({});
    const { result, query: { isLoading: loading }, } = useOne<Item & { item_script: ItemScript, item_price: ItemPrice[] }>({
        resource: "plan",
        id: params.id,
        // queryOptions: {
        //     enabled: !!record,
        // },
    });

    return (
        <ShowView>
            <ShowViewHeader resource="plan" edit={result?.status === 'active'} status />
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{result?.name}</CardTitle>
                        <CardDescription>
                            <div className="flex items-center gap-4">
                                <Badge variant={result?.status === "active" ? "default" : "secondary"}>
                                    {result?.status}
                                </Badge>
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium mb-2">ID</h4>
                            <p className="text-sm text-muted-foreground">
                                {loading ? "Loading..." : result?.id || "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-2">Script</h4>
                            <p className="text-sm text-muted-foreground">
                                {loading ? "Loading..." : result?.item_script.uuid || "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-2">Slug</h4>
                            <p className="text-sm text-muted-foreground">
                                {loading ? "Loading..." : result?.slug || "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-2">Name</h4>
                            <p className="text-sm text-muted-foreground">
                                {loading ? "Loading..." : result?.name || "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-2">Description</h4>
                            <p className="text-sm text-muted-foreground">
                                {loading ? "Loading..." : result?.description || "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-2">Created At</h4>
                            <p className="text-sm text-muted-foreground">
                                {result?.created_at ? new Date(result.created_at).toLocaleString() : "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-2">Updated At</h4>
                            <p className="text-sm text-muted-foreground">
                                {result?.updated_at ? `${new Date(result.updated_at).toLocaleString()}` : "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-4">Prices</h4>
                            <div className=" grid grid-cols-4 sm:grid-cols-6">
                                <div className="hidden sm:grid grid-cols-subgrid col-span-full py-2 border-b">
                                    <Label >
                                        Currency
                                    </Label>
                                    <Label >
                                        Model
                                    </Label>
                                    {PeriodUnit.enumValues.map(x => (
                                        <Label key={x}>
                                            {_.startCase(x)}
                                        </Label>
                                    ))}
                                </div>
                                {loaderData.currencies.map(({ currency }) => (
                                    <div key={currency.currency_code} className="grid text-sm/5 grid-cols-subgrid col-span-full py-2 border-b">
                                        <p className="flex gap-2">
                                            <Flag currency_code={currency.currency_code} className="w-6 rounded-md" />
                                            {currency.currency_code}
                                        </p>
                                        <p className="flex gap-2 col-span-3 sm:col-span-1">
                                            {_.startCase(_.lowerCase('flat_fee'))}
                                        </p>
                                        <p className="pt-2 sm:pt-0">
                                            -
                                        </p>
                                        <p className="pt-2 sm:pt-0">
                                            -
                                        </p>
                                        <p className="pt-2 sm:pt-0">
                                            -
                                        </p>
                                        <p className="pt-2 sm:pt-0">
                                            -
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {/* <Link to={result?.image ?? './'} target="_blank">
                                <p className="text-sm text-blue-500">
                                    {loading ? "Loading..." : result?.image || "-"}
                                </p>
                            </Link> */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ShowView>
    );
};
