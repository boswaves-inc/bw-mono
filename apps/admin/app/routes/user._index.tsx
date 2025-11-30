import { useList } from "@refinedev/core";
import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import { ListView, ListViewHeader } from "~/components/refine/views/list";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "~/components/refine/table";

import { User } from "@bw/core";
import type { Route } from "./+types/user._index";
import { TableAction } from "~/components/refine/table/action";

export default ({  }: Route.ComponentProps) => {
    const { result: { data }, query: { isLoading: loading } } = useList<User>({
        resource: "user",
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
                header: "",
                enableSorting: false,
                cell: ({ row }) => <TableAction resource="user" id={row.getValue('id')}/>,
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
            <ListViewHeader resource="user" wrapperClassName=" mb-6" />
            <Table table={table} />
        </ListView>
    )
}