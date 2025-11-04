import type { InferEnum } from "drizzle-orm";
import { customType, pgEnum } from "drizzle-orm/pg-core";


export const citext = customType<{ data: string }>({
    dataType() {
        return 'citext';
    },
});

export const Status = pgEnum('status', [
    'archived',
    'public'
])

export type Status = InferEnum<typeof Status>
