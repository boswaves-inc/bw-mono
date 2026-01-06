import { z, ZodType } from "zod/v4";

export type BlockArgs<T> = z.output<T>