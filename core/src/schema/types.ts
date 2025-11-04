import type { InferEnum } from "drizzle-orm";
import { customType, pgEnum } from "drizzle-orm/pg-core";


export const citext = customType<{ data: string }>({
    dataType() {
        return 'citext';
    },
});

export const ScriptType = pgEnum('script_type', [
    "library",
    "indicator",
    "screener",
    "strategy"
])


export const Status = pgEnum('status', [
    'archived',
    'public'
])

export type Status = InferEnum<typeof Status>
export type ScriptType = InferEnum<typeof ScriptType>
