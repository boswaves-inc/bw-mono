import { useList } from "@refinedev/core";
import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import { ListView, ListViewHeader } from "~/components/refine/views/list";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "~/components/refine/table";
import { Item, ItemScript, ItemPrice, Coupon } from "@bw/core";
import { TableActionCell, TableShowCell } from "~/components/refine/table/cell";
import { Badge } from "~/components/core/badge";

export default () => {
    const {
        result: { data },
        query: { isLoading: loading },
    } = useList({
        resource: "coupon",
    });

    const columns = useMemo(() => {
        const columnHelper = createColumnHelper<Coupon & { item_script: ItemScript, item_price: ItemPrice[] }>();

        return [
            columnHelper.accessor("id", {
                id: "id",
                header: "ID",
                enableSorting: false,
                cell: ({ cell }) => <TableShowCell cell={cell} />,
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
                cell: ({ cell }) => (
                    <Badge variant={cell.getValue() == 'deleted' ? 'destructive' : cell.getValue() == 'active' ? 'default' : 'outline'}>
                        {cell.renderValue()}
                    </Badge>
                )
            }),
            columnHelper.display({
                header: "",
                id: "actions",
                enableSorting: false,
                cell: ({ cell }) => <TableActionCell cell={cell} />,
            }),
        ];
    }, [data, loading]);


    const table = useTable<Coupon & { item_script: ItemScript, item_price: ItemPrice[] }>({
        columns,
        getRowId: row => row.id,
        refineCoreProps: {
            syncWithLocation: false,
        }
    });

    return (
        <ListView>
            <ListViewHeader resource="coupon" wrapperClassName="mb-6" />
            <Table table={table} />
        </ListView>
    )
}