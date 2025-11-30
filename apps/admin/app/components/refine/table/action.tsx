import type { Status } from "@bw/core";
import { useDeleteButton, useEditButton, useOne } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { MoreHorizontal } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/core/alert-dialog";
import { Button } from "~/components/core/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuPanel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/core/dropdown";

export const TableAction = ({ resource, id }: { resource: string, id: string }) => {
    const [dialog, setDialog] = useState(false)
    const [dropdown, setDropdown] = useState(false)

    const edit = useEditButton({ resource, id });
    const remove = useDeleteButton({ resource, id });

    const { result } = useOne<{ status: Status }>({ resource, id })

    const form = useForm({
        refineCoreProps: {
            id,
            resource,
            action: 'edit',
            onMutationSuccess: () => {
                setDropdown(false)
            }
        },
    })

    useEffect(() => {
        if(result != undefined){
            form.setValue('status', result.status === 'active' ? 'archived' : 'active')
        }
    }, [result])

    return (
        <Fragment>
            <DropdownMenu open={dropdown} onOpenChange={setDropdown}>
                <DropdownMenuTrigger asChild >
                    <Button variant={'ghost'} size={'sm'} >
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuPanel align="start" side="bottom">
                    <DropdownMenuItem disabled={edit.disabled} hidden={edit.hidden} asChild>
                        <edit.LinkComponent to={edit.to} replace={false}>
                            Edit
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