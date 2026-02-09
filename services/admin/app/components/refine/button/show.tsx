import { useShowButton } from "@refinedev/core";
import { Eye } from "lucide-react";
import React from "react";
import type { ShowButtonProps } from "./types";
import { Button } from "~/components/core/button";

export const ShowButton = React.forwardRef<React.ComponentRef<typeof Button>, ShowButtonProps>((
  { resource, recordItemId, accessControl, meta, children, onClick, ...rest }, ref
) => {
  const { hidden, disabled, LinkComponent, to, label } = useShowButton({
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
            <Eye className="h-4 w-4" />
            {/* <span>{label}</span> */}
          </div>
        )}
      </LinkComponent>
    </Button>
  );
});