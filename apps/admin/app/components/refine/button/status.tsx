import type { StatusButtonProps } from "./types";
import { Button } from "~/components/core/button";
import { useForm } from "@refinedev/react-hook-form";
import { useOne } from "@refinedev/core";
import type { Status } from "@bw/core";
import { useEffect } from "react";

export const StatusButton = ({ children, resource, recordItemId, ref, ...rest }: StatusButtonProps) => {
  const { result } = useOne<{ status: Status }>({
    resource,
    id: recordItemId,
  })

  const form = useForm({
    refineCoreProps: {
      id: recordItemId,
      resource,
      action: 'edit',
    },
  })

  useEffect(() => {
    if (result != undefined) {
      form.setValue('status', result.status === 'active' ? 'archived' : 'active')
    }
  }, [result])

  return (
    <Button {...rest} ref={ref} {...form.saveButtonProps} asChild>
      {children ?? (
        <div className="flex select-none items-center gap-2 font-semibold">
          <span>{result != undefined && (result.status == 'active' ? 'Archive' : 'Activate')}</span>
        </div>
      )}
    </Button>
  );

}