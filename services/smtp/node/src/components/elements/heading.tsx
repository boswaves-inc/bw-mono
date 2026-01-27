import z from "zod/v4";
import { tv } from "tailwind-variants";
import { cn } from "../../utils";
import { Heading as Primitive } from "@react-email/components";
import { Element } from "./+types/heading";

const variants = tv({
    variants: {
        size: {
            h1: 'text-4xl font-medium tracking-tighter text-pretty text-gray-950 dark:text-white',
            h2: 'mt-12 mb-10 text-2xl/8 font-medium tracking-tight text-gray-950 first:mt-0 last:mb-0',
            h3: 'mt-12 mb-10 text-xl/8 font-medium tracking-tight text-gray-950',
        }
    },
    defaultVariants: {
        size: 'h1'
    }
})

export const schema = ({ builder }: Element.SchemaArgs) => builder(z.object({
    size: z.enum<readonly (keyof typeof variants.variants.size)[]>([
        'h1',
        'h2',
        'h3'
    ]).optional()
}))


export default ({ size, ...props }: Element.RenderArgs) => (
    <Primitive {...props} className={cn(variants({ size }), "className")} as={size} >
        {/* {children} */}
    </Primitive>
)