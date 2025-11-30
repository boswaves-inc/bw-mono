import { useList } from "@refinedev/core";
import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import { ListView, ListViewHeader } from "~/components/refine/views/list";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "~/components/refine/table";

import { User } from "@bw/core";
import type { Route } from "./+types/user._index";
import { TableActionCell } from "~/components/refine/table/cell";

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
                cell: ({ cell }) => <TableActionCell cell={cell} />,
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