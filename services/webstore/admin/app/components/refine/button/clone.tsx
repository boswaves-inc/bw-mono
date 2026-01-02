import { useCloneButton } from "@refinedev/core";
import { Copy } from "lucide-react";
import React from "react";
import { Button } from "~/components/core/button";
import type { CloneButtonProps } from "./types";

export const CloneButton = React.forwardRef<React.ComponentRef<typeof Button>, CloneButtonProps>((
  { resource, recordItemId, accessControl, meta, children, onClick, ...rest }, ref
) => {
  const { hidden, disabled, LinkComponent, to, label } = useCloneButton({
    accessControl,
    resource,
    id: recordItemId,
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
            <Copy className="h-4 w-4" />
            <span>{label}</span>
          </div>
        )}
      </LinkComponent>
    </Button>
  );
});
