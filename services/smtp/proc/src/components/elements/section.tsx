import { Section as Primitive } from "@react-email/components";
import { ComponentProps } from "react";
import { cn } from "../utils";

type SectionProps = ComponentProps<typeof Primitive>

export const Section = ({ className, ...props }: SectionProps) => (
    <Primitive {...props} className={cn('', className)} />
)