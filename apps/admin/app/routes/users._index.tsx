import { useList } from "@refinedev/core";
import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import { ListView, ListViewHeader } from "~/components/refine/views/list";
import { createColumnHelper } from "@tanstack/react-table";
import { EditButton } from "~/components/refine/button/edit";
import { ShowButton } from "~/components/refine/button/show";
import { DeleteButton } from "~/components/refine/button/delete";
import Table from "~/components/refine/table";

import { User } from "@bw/core";
import type { Route } from "./+types/users._index";

export default ({  }: Route.ComponentProps) => {
    const { result: { data }, query: { isLoading: loading } } = useList<User>({
        resource: "users",
        pagination: {
            currentPage: 1,
            pageSize: 999,
        },
    });

    const columns = useMemo(() => {
        const columnHelper = createColumnHelper<User>();

        return [
            columnHelper.accessor("uid", {
                id: "uid",
                header: "UID",
                enableSorting: false,
            }),
            columnHelper.accessor("cbid", {
                id: "cbid",
                header: "CBID",
                enableSorting: false,
            }),
            columnHelper.accessor("role", {
                id: "role",
                header: "Role",
                enableSorting: true,
            }),
            columnHelper.accessor('email', {
                id: "email",
                header: "Email",
                enableSorting: true,
            }),
            columnHelper.display({
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <EditButton recordItemId={row.original.uid} size="sm" />
                        <ShowButton recordItemId={row.original.uid} size="sm" />
                        <DeleteButton recordItemId={row.original.uid} size="sm" />
                    </div>
                ),
                enableSorting: false,
            }),
        ];
    }, [data, loading]);


    const table = useTable<User>({
        columns,
        refineCoreProps: {
            syncWithLocation: true,
        }
    });

    return (
        <ListView>
            <ListViewHeader resource="users" wrapperClassName=" mb-6" />
            <Table table={table} />
        </ListView>
    )
}