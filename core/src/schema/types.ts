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

export const PriceModel = pgEnum('price_model', [
    'flat_fee',
    'per_unit'
])

export const ScriptType = pgEnum('script_type', [
    "library",
    "indicator",
    "screener",
    "strategy"
])


export const CouponType = pgEnum('coupon_type', [
    "fixed",
    "percentage",
])


export const CouponDuration = pgEnum('coupon_duration', [
    "one_time",
    "forever",
    "limited_period"
])

export const CouponApplication = pgEnum('coupon_application', [
    "invoice",
    "item",
])


export type Status = InferEnum<typeof Status>
export type PeriodUnit = InferEnum<typeof PeriodUnit>
export type PriceModel = InferEnum<typeof PriceModel>
export type ScriptType = InferEnum<typeof ScriptType>
export type CouponType = InferEnum<typeof CouponType>
export type CouponDuration = InferEnum<typeof CouponDuration>
export type CouponApplication = InferEnum<typeof CouponApplication>
