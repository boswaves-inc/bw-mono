import { useListButton } from "@refinedev/core";
import { List } from "lucide-react";
import React from "react";
import type { ListButtonProps } from "./types";
import { Button } from "~/components/core/button";

export const ListButton = React.forwardRef<React.ComponentRef<typeof Button>, ListButtonProps>((
  { resource, accessControl, meta, children, onClick, ...rest }, ref
) => {
  const { hidden, disabled, LinkComponent, to, label } = useListButton({
    resource,
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
            <List className="w-4 h-4" />
            <span>{label}</span>
          </div>
        )}
      </LinkComponent>
    </Button>
  );
});

ListButton.displayName = "ListButton";
