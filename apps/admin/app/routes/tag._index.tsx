import { useList } from "@refinedev/core";
import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import { ListView, ListViewHeader } from "~/components/refine/views/list";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "~/components/refine/table";
import { Tag } from "@bw/core";

import { TableActionCell, TableShowCell } from "~/components/refine/table/cell";

export default () => {
    const {
        result: { data },
        query: { isLoading: loading },
    } = useList({
        resource: "tag",
        pagination: {
            currentPage: 1,
            pageSize: 999,
        },
    });

    const columns = useMemo(() => {
        const columnHelper = createColumnHelper<Tag>();

        return [
            columnHelper.accessor("id", {
                id: "id",
                header: "ID",
                enableSorting: false,
                cell: ({ cell }) => <TableShowCell cell={cell} />,
            }),
            columnHelper.accessor('name', {
                id: "name",
                header: "Name",
                enableSorting: true,
            }),
            columnHelper.accessor('slug', {
                id: "slug",
                header: "Slug",
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
                cell: ({ cell }) => <TableActionCell cell={cell} />,
            }),
        ];
    }, [data, loading]);


    const table = useTable<Tag>({
        columns,
        refineCoreProps: {
            syncWithLocation: false,
        }
    });

    return (
        <ListView>
            <ListViewHeader resource="tag" wrapperClassName="mb-6" />
            <Table table={table} />
        </ListView>
    )
}