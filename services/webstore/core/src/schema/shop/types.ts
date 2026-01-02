import type { InferEnum } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";

export const ItemStatus = pgEnum('item_status', [
    'archived',
    'deleted',
    'active',
])

export type ItemStatus = InferEnum<typeof ItemStatus>
