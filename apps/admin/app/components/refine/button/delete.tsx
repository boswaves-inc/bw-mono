import { useDeleteButton } from "@refinedev/core";
import { Loader2, Trash } from "lucide-react";
import React from "react";
import type { DeleteButtonProps } from "./types";
import { Button } from "~/components/core/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/core/popover";

export const DeleteButton = React.forwardRef<React.ComponentRef<typeof Button>, DeleteButtonProps>((
  { resource, recordItemId, accessControl, meta, children, ...rest }, ref
) => {
  const [open, setOpen] = React.useState(false);

  const {
    label,
    hidden,
    loading,
    disabled,
    cancelLabel,
    confirmTitle,
    confirmOkLabel,
    onConfirm,
  } = useDeleteButton({
    resource,
    id: recordItemId,
    accessControl,
    meta,
  });

  const onConfirmClick = () => {
    onConfirm();
    setOpen(false);
  }

  if (hidden || rest.hidden) {
    return null
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span>
          <Button
            variant="destructive"
            {...rest}
            ref={ref}
            disabled={disabled || rest.disabled || loading}
          >

            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children ?? (
              <div className="flex items-center gap-2 font-semibold">
                <Trash className="h-4 w-4" />
                <span>{label}</span>
              </div>
            )}
          </Button>
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="start">
        <div className="flex flex-col gap-2">
          <p className="text-sm">{confirmTitle}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              {cancelLabel}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={loading}
              onClick={onConfirmClick}
            >
              {confirmOkLabel}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});
