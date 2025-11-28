

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
    'active'
])

export const PeriodUnit = pgEnum('period_unit', [
    'day',
    'week',
    "month",
    'year'
])

export const PricingModel = pgEnum('pricing_model', [
    'flat_fee',
    'per_unit'
])

export const ScriptType = pgEnum('script_type', [
    "library",
    "indicator",
    "screener",
    "strategy"
])

export type Status = InferEnum<typeof Status>
export type PeriodUnit = InferEnum<typeof PeriodUnit>
export type PricingModel = InferEnum<typeof PricingModel>
export type ScriptType = InferEnum<typeof ScriptType>
