import { useCreateButton } from "@refinedev/core";
import { Plus } from "lucide-react";
import React from "react";
import type { CreateButtonProps } from "./types";
import { Button } from "~/components/core/button";

export const CreateButton = React.forwardRef<React.ComponentRef<typeof Button>, CreateButtonProps>(({ resource, accessControl, meta, children, onClick, ...rest }, ref) => {
    const { hidden, disabled, LinkComponent, to, label } = useCreateButton({
        resource,
        accessControl,
        meta,
    });

    const isDisabled = disabled || rest.disabled;
    const isHidden = hidden || rest.hidden;

    if (isHidden) return null;

    return (
        <Button {...rest} ref={ref} disabled={isDisabled} asChild>
            <LinkComponent
                to={to}
                replace={false}
                onClick={(e: React.PointerEvent<HTMLButtonElement>) => {
                    if (isDisabled) {
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
                        <Plus className="w-4 h-4" />
                        <span>{label ?? "Create"}</span>
                    </div>
                )}
            </LinkComponent>
        </Button>
    );
});
