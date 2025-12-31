import type { Status } from "@boswaves/core";
import { useDeleteButton, useEditButton, useOne, useRefineContext, useResourceParams, useShowButton, type BaseRecord } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import type { Cell, RowData } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/core/alert-dialog";
import { Button } from "~/components/core/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuPanel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/core/dropdown";

export const TableShowCell = <TData extends RowData, TValue extends ReactNode>({ cell }: { cell: Cell<TData, TValue> }) => {
    const { resource } = useResourceParams()
    const { to, LinkComponent } = useShowButton({ resource: resource?.name, id: cell.row.id });

    return (
        <Button asChild variant={'link'} className=" p-0 truncate w-auto text-sm h-auto inline">
            <LinkComponent to={to}>
                {cell.renderValue()}
            </LinkComponent>
        </Button>
    )
}

export const TableActionCell = <TData extends RowData, TValue extends any>({ cell }: { cell: Cell<TData, TValue> }) => {
    const [dialog, setDialog] = useState(false)
    const [dropdown, setDropdown] = useState(false)

    const { resource } = useResourceParams()
    const { result } = useOne<{ status: Status }>({ resource: resource?.name, id: cell.row.id })

    const show = useShowButton({ resource: resource?.name, id: cell.row.id });
    const edit = useEditButton({ resource: resource?.name, id: cell.row.id });
    const remove = useDeleteButton({ resource: resource?.name, id: cell.row.id });

    const form = useForm({
        refineCoreProps: {
            action: 'edit',
            id: cell.row.id,
            resource: resource?.name,
            onMutationSuccess: () => {
                setDropdown(false)
            }
        },
    })

    useEffect(() => {
        if (result != undefined) {
            form.setValue('status', result.status === 'active' ? 'archived' : 'active')
        }
    }, [result])

    return (
        <Fragment>
            <DropdownMenu open={dropdown} onOpenChange={setDropdown}>
                <DropdownMenuTrigger asChild >
                    <Button className="" variant={'ghost'} size={'sm'} >
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuPanel align="end" side="bottom">
                    <DropdownMenuItem disabled={edit.disabled} hidden={edit.hidden || result?.status === 'archived'} asChild>
                        <edit.LinkComponent to={edit.to} replace={false}>
                            Edit
                        </edit.LinkComponent>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={show.disabled} hidden={show.hidden} asChild>
                        <edit.LinkComponent to={show.to} replace={false}>
                            Show
                        </edit.LinkComponent>
                    </DropdownMenuItem>
                    <DropdownMenuItem  {...form.saveButtonProps}>
                        {result != undefined && (result.status == 'active' ? 'Archive' : 'Activate')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" disabled={remove.disabled || remove.loading} hidden={remove.hidden} onClick={() => setDialog(true)}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuPanel>
            </DropdownMenu>
            <AlertDialog open={dialog} onOpenChange={setDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {remove.confirmTitle}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" size="sm" onClick={() => setDialog(false)}>
                            {remove.cancelLabel}
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={remove.disabled || remove.loading}
                            onClick={remove.onConfirm}
                        >
                            {remove.confirmOkLabel}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Fragment>
    )
}