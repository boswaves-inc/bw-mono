import React from "react";
import { Pencil } from "lucide-react";
import { useEditButton } from "@refinedev/core";
import type { EditButtonProps } from "./types";
import { Button } from "~/components/core/button";

export const EditButton = React.forwardRef<React.ComponentRef<typeof Button>, EditButtonProps>((
  { resource, recordItemId, accessControl, meta, children, onClick, ...rest }, ref
) => {
  const { hidden, disabled, LinkComponent, to, label } = useEditButton({
    resource,
    id: recordItemId,
    accessControl,
    meta,
  });

  if (hidden || rest.hidden) {
    return null
  };

  return (
    <Button {...rest} ref={ref} disabled={disabled || rest.disabled} asChild>
      <LinkComponent
        to={to}
        replace={false}
        onClick={(e: React.PointerEvent<HTMLButtonElement>) => {
          if (disabled || rest.disabled) {
            e.preventDefault();
            return;
          }
          if (onClick) {
            e.preventDefault();
            onClick(e);
          }
        }}
      >
        {children ?? (
          <div className="flex items-center gap-2 font-semibold">
            <Pencil className="h-4 w-4" />
            <span>{label}</span>
          </div>
        )}
      </LinkComponent>
    </Button>
  );
});
