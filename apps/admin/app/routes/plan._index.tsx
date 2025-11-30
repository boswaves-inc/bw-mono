import { useList } from "@refinedev/core";
import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import { ListView, ListViewHeader } from "~/components/refine/views/list";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "~/components/refine/table";

import { Item, ItemScript, ItemPrice } from "@bw/core";
import { TableAction } from "~/components/refine/table/action";

export default () => {
    const {
        result: { data },
        query: { isLoading: loading },
    } = useList({
        resource: "plan",
        pagination: {
            currentPage: 1,
            pageSize: 999,
        },
    });

    const columns = useMemo(() => {
        const columnHelper = createColumnHelper<Item & { item_script: ItemScript, item_price: ItemPrice[]}>();

        return [
            columnHelper.accessor("id", {
                id: "id",
                header: "ID",
                enableSorting: false,
            }),
            columnHelper.accessor('item_script.uuid', {
                id: "uuid",
                header: "Script",
                enableSorting: false,
            }),
            columnHelper.accessor('name', {
                id: "name",
                header: "Name",
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
                cell: ({ row }) => <TableAction resource="tag" id={row.getValue('id')}/>,
            }),
        ];
    }, [data, loading]);


    const table = useTable<Item & { item_script: ItemScript, item_price: ItemPrice[]}>({
        columns,
        refineCoreProps: {
            syncWithLocation: false,
        }
    });

    return (
        <ListView>
            <ListViewHeader resource="plan" wrapperClassName="mb-6" />
            <Table table={table} />
        </ListView>
    )
}