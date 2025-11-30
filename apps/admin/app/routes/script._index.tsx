import { useList } from "@refinedev/core";
import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import { ListView, ListViewHeader } from "~/components/refine/views/list";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "~/components/refine/table";
import { Script, Tag } from "@bw/core";
import { TableAction } from "~/components/refine/table/action";

export default () => {
    const {
        result: { data },
        query: { isLoading: loading },
    } = useList<Script>({
        resource: "script",
        pagination: {
            currentPage: 1,
            pageSize: 999,
        },
    });

    const columns = useMemo(() => {
        const columnHelper = createColumnHelper<Script>();

        return [
            columnHelper.accessor("id", {
                id: "id",
                header: "ID",
                enableSorting: false,
            }),
            columnHelper.accessor('uuid', {
                id: "uuid",
                header: "UUID",
                enableSorting: true,
            }),
            columnHelper.accessor('name', {
                id: "name",
                header: "Name",
                enableSorting: true,
            }),
            columnHelper.accessor('type', {
                id: "type",
                header: "Type",
                enableSorting: true,
            }),
            columnHelper.accessor('status', {
                id: "status",
                header: "Status",
                enableSorting: true,
            }),
            columnHelper.display({
                id: "actions",
                header: "",
                enableSorting: false,
                cell: ({ row }) => <TableAction resource="script" id={row.getValue('id')}/>,
            }),
        ];
    }, [data, loading]);


    const table = useTable<Script>({
        columns,
        refineCoreProps: {
            syncWithLocation: false,
        }
    });

    return (
        <ListView>
            <ListViewHeader resource="script" wrapperClassName="mb-6" />
            <Table table={table} />
        </ListView>
    )
}