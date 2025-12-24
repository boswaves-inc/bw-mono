import { customType, pgEnum } from "drizzle-orm/pg-core";
import type { InferEnum } from "drizzle-orm";

export const citext = customType<{ data: string }>({
    dataType() {
        return 'citext';
    },
});


export const PeriodUnit = pgEnum('period_unit', [
    'day',
    'week',
    "month",
    'year'
])

export type PeriodUnit = InferEnum<typeof PeriodUnit>