import { useList } from "@refinedev/core";
import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import { ListView, ListViewHeader } from "~/components/refine/views/list";
import { createColumnHelper } from "@tanstack/react-table";
import { EditButton } from "~/components/refine/button/edit";
import { ShowButton } from "~/components/refine/button/show";
import { DeleteButton } from "~/components/refine/button/delete";
import Table from "~/components/refine/table";

import { CouponData } from "@bw/core";
import { DataTableSorter } from "~/components/refine/table/sorter";

export default () => {
    const {
        result: { data },
        query: { isLoading: loading },
    } = useList({
        resource: "coupons",
        pagination: {
            currentPage: 1,
            pageSize: 999,
        },
    });

    const columns = useMemo(() => {
        const columnHelper = createColumnHelper<typeof CouponData.$inferSelect>();

        return [
            columnHelper.accessor("id", {
                id: "id",
                header: "ID",
                enableSorting: false,
            }),
            columnHelper.accessor('name', {
                id: "name",
                header: "Name",
                enableSorting: true,
            }),
            columnHelper.accessor("type", {
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
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <EditButton recordItemId={row.original.id} size="sm" />
                        <ShowButton recordItemId={row.original.id} size="sm" />
                        <DeleteButton recordItemId={row.original.id} size="sm" />
                    </div>
                ),
                enableSorting: false,
            }),
        ];
    }, [data, loading]);


    const table = useTable<typeof CouponData.$inferSelect>({
        columns,
        refineCoreProps: {
            syncWithLocation: true,
        }
    });

    return (
        <ListView>
            <ListViewHeader wrapperClassName="mb-6" resource="coupons" />
            <Table table={table} >
            </Table>
        </ListView>
    )
}