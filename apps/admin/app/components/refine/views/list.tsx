// "use client";

import type { PropsWithChildren } from "react";
import { useResourceParams, useUserFriendlyName } from "@refinedev/core";
import { cn } from "~/utils";
import { Breadcrumb } from "~/components/core/breadcrumb";
import { Separator } from "~/components/core/separator";
import { CreateButton } from "../button/create";

type ListViewProps = PropsWithChildren<{
    className?: string;
}>;

export function ListView({ children, className }: ListViewProps) {
    return (
        <div className={cn("flex flex-col", "gap-4", className)}>{children}</div>
    );
}

type ListHeaderProps = PropsWithChildren<{
    resource?: string;
    title?: string;
    canCreate?: boolean;
    headerClassName?: string;
    wrapperClassName?: string;
}>;

export const ListViewHeader = ({
    canCreate,
    resource: resourceFromProps,
    title: titleFromProps,
    wrapperClassName,
    headerClassName,
}: ListHeaderProps) => {
    const getUserFriendlyName = useUserFriendlyName();

    const { resource, identifier } = useResourceParams({
        resource: resourceFromProps,
    });

    const createable = canCreate ?? !!resource?.create;
    const title = titleFromProps ?? getUserFriendlyName(resource?.meta?.label ?? identifier ?? resource?.name, "plural");

    return (
        <div className={cn("flex flex-col", "gap-4", wrapperClassName)}>
            <div className="flex items-center relative gap-2">
                <div className="bg-background z-2 pr-4">
                    <Breadcrumb />
                </div>
                <Separator className={cn("absolute", "left-0", "right-0", "z-1")} />
            </div>
            <div className={cn("flex", "justify-between", "gap-4", headerClassName)}>
                <h2 className="text-2xl font-bold">
                    {title || (
                        <div className="w-40 animate-pulse ease-in-out duration-100 h-9 rounded-lg bg-muted" />
                    )}
                </h2>
                {createable && (
                    <div className="flex items-center gap-2">
                        <CreateButton resource={identifier ?? resource?.name} />
                    </div>
                )}
            </div>
        </div>
    );
};