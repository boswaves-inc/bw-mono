import { ItemScript, PeriodUnit, ItemPrice, PricingModel, type Item, Tag } from "@bw/core";
import { useOne, useShow } from "@refinedev/core";
import _ from "lodash";
import { data, Link } from "react-router";
import { Badge } from "~/components/core/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/core/card";
import { Label } from "~/components/core/label";
import { Separator } from "~/components/core/separator";
import { Flag } from "~/components/flag";
import { ShowView, ShowViewHeader } from "~/components/refine/views/show";
import type { Route } from "./+types/plans.$id._index";

export const loader = async ({ context }: Route.LoaderArgs) => {
    const { list: currencies } = await context.chargebee.currency.list()

    return data({ currencies })
}

export default ({ loaderData, params }: Route.ComponentProps) => {
    
    const { result, query: { isLoading: loading }, } = useOne<Tag>({
        resource: "tags",
        id: params.id,
    });

    return (
        <ShowView>
            <ShowViewHeader resource="tags" />
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{result?.value}</CardTitle>
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
                            <h4 className="text-sm font-medium mb-2">Value</h4>
                            <p className="text-sm text-muted-foreground">
                                {loading ? "Loading..." : result?.value || "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-2">Status</h4>
                            <p className="text-sm text-muted-foreground">
                                {loading ? "Loading..." : result?.status || "-"}
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
                    </CardContent>
                </Card>
            </div>
        </ShowView>
    );
};
