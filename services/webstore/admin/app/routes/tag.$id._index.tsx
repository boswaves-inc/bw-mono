import {  Tag } from "@boswaves-inc/webstore-core";
import { useOne } from "@refinedev/core";
import _ from "lodash";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/core/card";
import { Separator } from "~/components/core/separator";
import { ShowView, ShowViewHeader } from "~/components/refine/views/show";
import type { Route } from "./+types/tag.$id._index";

export default ({ params }: Route.ComponentProps) => {
    
    const { result, query: { isLoading: loading }, } = useOne<Tag>({
        resource: "tag",
        id: params.id,
    });

    return (
        <ShowView>
            <ShowViewHeader resource="tag" edit={result?.status === 'active'} status  />
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{result?.name}</CardTitle>
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
                            <h4 className="text-sm font-medium mb-2">Name</h4>
                            <p className="text-sm text-muted-foreground">
                                {loading ? "Loading..." : result?.name || "-"}
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
