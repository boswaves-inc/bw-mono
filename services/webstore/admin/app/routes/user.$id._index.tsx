import type {  User } from "@boswaves/core";
import { useOne, useShow } from "@refinedev/core";
import { Badge } from "~/components/core/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/core/card";
import { Separator } from "~/components/core/separator";
import { ShowView, ShowViewHeader } from "~/components/refine/views/show";

export default () => {
    const { result: record, query } = useShow<User>({});

    const { result, query: { isLoading: loading }, } = useOne<User>({
        resource: "user",
        id: record?.uid || "",
        queryOptions: {
            enabled: !!record,
        },
    });


    return (
        <ShowView>
            <ShowViewHeader resource="user" status />
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{`${record?.first_name} ${record?.last_name}`}</CardTitle>
                        <CardDescription>
                            <div className="flex items-center gap-4">
                                <Badge
                                    variant={
                                        record?.role === "user" ? "default" : "secondary"
                                    }
                                >
                                    {record?.role}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    {record?.email}
                                </span>
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium mb-2">UID</h4>
                            <p className="text-sm text-muted-foreground">
                                {record?.uid ?? "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-2">CBID</h4>
                            <p className="text-sm text-muted-foreground">
                                {record?.cbid ?? "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-2">First Name</h4>
                            <p className="text-sm text-muted-foreground">
                                {record?.first_name ?? "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-2">Last Name</h4>
                            <p className="text-sm text-muted-foreground">
                                {record?.last_name ?? "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-2">Provider</h4>
                            <p className="text-sm text-muted-foreground">
                                {record?.provider ?? "-"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-2">Provider ID</h4>
                            <p className="text-sm text-muted-foreground">
                                {record?.provider_id ?? "-"}
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
