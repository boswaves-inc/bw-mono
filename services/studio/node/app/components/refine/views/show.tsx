
import type { PropsWithChildren } from "react";

import {
    useBack,
    useResourceParams,
    useUserFriendlyName,
} from "@refinedev/core";
import { ArrowLeftIcon } from "lucide-react";
import { cn } from "~/utils";
import { Breadcrumb } from "~/components/core/breadcrumb";
import { Separator } from "~/components/core/separator";
import { Button } from "~/components/core/button";
import { RefreshButton } from "../button/refresh";
import { EditButton } from "../button/edit";
import { StatusButton } from "../button/status";

type ShowViewProps = PropsWithChildren<{
    className?: string;
}>;

export function ShowView({ children, className }: ShowViewProps) {
    return (
        <div className={cn("flex flex-col", "gap-4", className)}>{children}</div>
    );
}

type ShowViewHeaderProps = PropsWithChildren<{
    resource?: string;
    title?: string;
    wrapperClassName?: string;
    headerClassName?: string;
    
    edit?: boolean
    status?: boolean
}>;

export const ShowViewHeader = ({
    resource: resourceFromProps,
    title: titleFromProps,
    wrapperClassName,
    headerClassName,
    status,
    edit,
}: ShowViewHeaderProps) => {
    const back = useBack();
    const getUserFriendlyName = useUserFriendlyName();

    const { id: recordItemId } = useResourceParams();
    const { resource, identifier } = useResourceParams({
        resource: resourceFromProps,
    });

    const resourceName = resource?.name ?? identifier;
    const title = titleFromProps ?? getUserFriendlyName(
        resource?.meta?.label ?? identifier ?? resource?.name,
        "singular"
    );

    return (
        <div className={cn("flex flex-col", "gap-4", wrapperClassName)}>
            <div className="flex items-center relative gap-2">
                <div className="bg-background z-2 pr-4">
                    <Breadcrumb />
                </div>
                <Separator className={cn("absolute", "left-0", "right-0", "z-1")} />
            </div>
           <div
                className={cn(
                    "flex",
                    "gap-1",
                    "items-center",
                    "justify-between",
                    "-ml-2.5",
                    headerClassName
                )}
            >
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={back}>
                        <ArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    <h2 className="text-2xl font-bold">
                        {title || (
                            <div className="w-40 animate-pulse ease-in-out duration-100 h-9 rounded-lg bg-white/20" />
                        )}
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <RefreshButton
                        variant="outline"
                        recordItemId={recordItemId}
                        resource={resourceName}
                    />
                    <EditButton
                        hidden={edit !== true}
                        variant="outline"
                        recordItemId={recordItemId}
                        resource={resourceName}
                        />
                    <StatusButton
                        hidden={status !== true}
                        variant="outline"
                        recordItemId={recordItemId}
                        resource={resourceName}
                    />
                </div>
            </div>
        </div>
    );
};

ShowView.displayName = "ShowView";
