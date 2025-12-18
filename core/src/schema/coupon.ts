// import { ne, sql, type InferEnum, type InferSelectModel } from "drizzle-orm";
// import { index, pgEnum, pgTable, unique, uniqueIndex } from "drizzle-orm/pg-core";
// import { Status } from "./types";
// import { ItemType } from "./item";
import { sql, type InferEnum, type InferSelectModel } from "drizzle-orm"
import { check, pgEnum, pgTable, uniqueIndex } from "drizzle-orm/pg-core"
import { PeriodUnit, Status } from "./types"

export const CouponDiscount = pgEnum('coupon_discount', [
    "percentage",
    "fixed_amount",
])

export const CouponDuration = pgEnum('coupon_duration', [
    "one_time",
    "forever",
    "limited_period"
])

export const CouponApplication = pgEnum('coupon_application', [
    "invoice_amount",
    "each_specified_item",
])

export const Coupon = pgTable("coupons", (t) => ({
    id: t.uuid().notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: t.text("name").notNull(),
    apply_on: CouponApplication("apply_on").notNull(),

    period: t.integer(),
    period_unit: PeriodUnit('period_unit'),
    duration_type: CouponDuration("duration_type").notNull(),

    discount_type: CouponDiscount("discount_type").notNull(),
    discount_amount: t.integer("discount_amount"),
    discount_currency: t.text("discount_currency"),
    discount_percentage: t.doublePrecision("discount_percentage"),

    valid_from: t.timestamp({ withTimezone: true }),
    valid_till: t.timestamp({ withTimezone: true }),

    max_redemptions: t.integer(),
    status: Status('status').notNull(),

    created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: t.timestamp({ withTimezone: true }).defaultNow().notNull()
}), table => [
    uniqueIndex("coupons_name_unq").on(table.name).where(sql`status != 'deleted'`),
    check("coupons_discount_check",
        sql`(discount_type = 'percentage' AND discount_percentage IS NOT NULL) OR (discount_type = 'fixed_amount' AND discount_currency IS NOT NULL AND discount_amount IS NOT NULL)`
    ),
    check("coupons_valid_check",
        sql`(valid_from IS NULL AND valid_till IS NULL) OR (valid_from IS NOT NULL AND valid_till IS NOT NULL and valid_till > valid_from)`
    ),
]);

export const CouponSet = pgTable("coupon_sets", (t) => ({
    created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: t.timestamp({ withTimezone: true }).defaultNow().notNull()
}))

export const CouponCode = pgTable("coupon_codes", (t) => ({
    created_at: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updated_at: t.timestamp({ withTimezone: true }).defaultNow().notNull()
}))

/** https://apidocs.chargebee.com/docs/api/coupons */
export type Coupon = InferSelectModel<typeof Coupon>

// // /** https://apidocs.chargebee.com/docs/api/coupons */
// export type CouponItem = InferSelectModel<typeof CouponItem>

export type CouponDiscount = InferEnum<typeof CouponDiscount>
export type CouponDuration = InferEnum<typeof CouponDuration>
export type CouponApplication = InferEnum<typeof CouponApplication>