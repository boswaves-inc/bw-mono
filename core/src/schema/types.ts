

import type { InferEnum } from "drizzle-orm";
import { customType, pgEnum } from "drizzle-orm/pg-core";

export const citext = customType<{ data: string }>({
    dataType() {
        return 'citext';
    },
});

export const Status = pgEnum('status', [
    'archived',
    'deleted',
    'active',
])

export const PeriodUnit = pgEnum('period_unit', [
    'day',
    'week',
    "month",
    'year'
])

export type Status = InferEnum<typeof Status>
export type PeriodUnit = InferEnum<typeof PeriodUnit>
