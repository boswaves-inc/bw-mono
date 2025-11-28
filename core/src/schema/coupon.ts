// import { ne, sql, type InferEnum, type InferSelectModel } from "drizzle-orm";
// import { index, pgEnum, pgTable, unique, uniqueIndex } from "drizzle-orm/pg-core";
// import { Status } from "./types";
// import { ItemType } from "./item";

// // export const CouponType = pgEnum('coupon_type', [
// //     "fixed",
// //     "percentage",
// // ])

// // export const CouponDuration = pgEnum('coupon_duration', [
// //     "one_time",
// //     "forever",
// //     "limited_period"
// // ])

// // export const CouponApplication = pgEnum('coupon_application', [
// //     "invoice",
// //     "item",
// // ])

// // export const CouponConstraint = pgEnum('coupon_constraint', [
// //     "none",
// //     "all",
// //     "specific",
// //     "criteria",
// // ])

// // export const Coupon = pgTable("coupon_info", (t) => ({
// //     id: t.uuid().notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
// //     name: t.text("name").notNull(),
// //     slug: t.text("slug").unique().notNull().generatedAlwaysAs(
// //         sql`lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))`
// //     ),
// //     status: Status("status").notNull(),
// //     type: CouponType("type").notNull(),
// //     value: t.doublePrecision("value").notNull(),
// //     apply_on: CouponApplication("apply_on").notNull(),
// //     created_at: t.timestamp().defaultNow().notNull(),
// //     updated_at: t.timestamp().defaultNow().notNull()
// // }), table => [
// //     uniqueIndex("coupon_info_slug_unq").on(table.slug),
// //     uniqueIndex("coupon_info_idx_unq").on(table.id).where(sql`status != 'deleted'`),
// //     uniqueIndex("coupon_info_name_unq").on(table.name).where(sql`status != 'deleted'`),
// // ]);

// // export const CouponItem = pgTable("coupon_constraint", (t) => ({
// //     id: t.uuid().notNull().primaryKey().references(() => Coupon.id, {
// //         onDelete: 'cascade',
// //         onUpdate: 'cascade'
// //     }),
// //     type: ItemType('type').notNull(),
// //     created_at: t.timestamp().defaultNow().notNull(),
// //     updated_at: t.timestamp().defaultNow().notNull()
// // }));

// // /** https://apidocs.chargebee.com/docs/api/coupons */
// // export type Coupon = InferSelectModel<typeof Coupon>

// // /** https://apidocs.chargebee.com/docs/api/coupons */
// // export type CouponItem = InferSelectModel<typeof CouponItem>

// // export type CouponType = InferEnum<typeof CouponType>
// // export type CouponDuration = InferEnum<typeof CouponDuration>
// // export type CouponConstraint = InferEnum<typeof CouponConstraint>
// // export type CouponApplication = InferEnum<typeof CouponApplication>