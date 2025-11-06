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

export const Status = pgEnum('status', [
    'archived',
    'public'
])

export type Status = InferEnum<typeof Status>
export type ScriptType = InferEnum<typeof ScriptType>
export type CouponType = InferEnum<typeof CouponType>
export type CouponDuration = InferEnum<typeof CouponDuration>
export type CouponApplication = InferEnum<typeof CouponApplication>
