import type { InferEnum } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";

export const Status = pgEnum('status', [
    'pending',
    'published'
])

export type Status = InferEnum<typeof Status>
