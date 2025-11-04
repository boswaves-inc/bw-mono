import type { Item, Script } from "@bw/core";
import { useOne, useShow } from "@refinedev/core";
import { Badge } from "~/components/core/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/core/card";
import { Separator } from "~/components/core/separator";
import { ShowView, ShowViewHeader } from "~/components/refine/views/show";

export default () => {
    const { result: record, query } = useShow<Script>({});

    const {
        result,
        query: { isLoading: loading },
    } = useOne<Script>({
        resource: "scripts",
        id: record?.id || "",
        queryOptions: {
            enabled: !!record,
        },
    });

    return (
        <ShowView>
            <ShowViewHeader resource="scripts" />
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{record?.title}</CardTitle>
                        <CardDescription>
                            <div className="flex items-center gap-4">
                                <Badge variant={record?.status === "public" ? "default" : "secondary"}>
                                    {record?.status}
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
                            <h4 className="text-sm font-medium mb-2">UUID</h4>
                            <p className="text-sm text-muted-foreground">
                                {loading ? "Loading..." : result?.uuid || "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-2">Title</h4>
                            <p className="text-sm text-muted-foreground">
                                {loading ? "Loading..." : result?.title || "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-2">Created At</h4>
                            <p className="text-sm text-muted-foreground">
                                {record?.created_at ? new Date(record.created_at).toLocaleString() : "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-2">Updated At</h4>
                            <p className="text-sm text-muted-foreground">
                                {record?.updated_at ? `${new Date(record.updated_at).toLocaleString()}` : "-"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ShowView>
    );
};
