import { useRefreshButton } from "@refinedev/core";
import { RefreshCcw } from "lucide-react";
import React from "react";
import type { RefreshButtonProps } from "./types";
import { cn } from "~/utils";
import { Button } from "~/components/core/button";

export const RefreshButton = React.forwardRef<React.ComponentRef<typeof Button>, RefreshButtonProps>((
  { resource, recordItemId, dataProviderName, meta, children, ...rest }, ref
) => {
  const {
    onClick: refresh,
    loading,
    label,
  } = useRefreshButton({
    resource,
    id: recordItemId,
    dataProviderName,
    meta,
  });

  return (
    <Button
      onClick={(e: React.PointerEvent<HTMLButtonElement>) => {
        if (rest.disabled || loading) {
          e.preventDefault();
          return;
        }
        refresh();
      }}
      {...rest}
      ref={ref}
      disabled={rest.disabled || loading}
    >
      {children ?? (
        <div className="flex items-center gap-2">
          <RefreshCcw
            className={cn("h-4 w-4", {
              "animate-spin": loading,
            })}
          />
          {/* <span>{label ?? "Refresh"}</span> */}
        </div>
      )}
    </Button>
  );
});
