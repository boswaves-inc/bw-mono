DROP MATERIALIZED VIEW "public"."coupon_info";--> statement-breakpoint
ALTER TABLE "item_coupon" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."coupon_type";--> statement-breakpoint
CREATE TYPE "public"."coupon_type" AS ENUM('fixed', 'percentage');--> statement-breakpoint
ALTER TABLE "item_coupon" ALTER COLUMN "type" SET DATA TYPE "public"."coupon_type" USING "type"::"public"."coupon_type";--> statement-breakpoint
ALTER TABLE "item_coupon" ADD COLUMN "amount" integer;--> statement-breakpoint
ALTER TABLE "item_coupon" ADD COLUMN "percentage" double precision;--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."coupon_info" AS (select "item_info"."id", "item_info"."name", "item_info"."status", "item_coupon"."type", CASE
            WHEN "item_coupon"."type" = 'percentage' THEN "item_coupon"."percentage"
            ELSE "item_coupon"."amount"
        END as "value", "item_coupon"."apply_on", "item_coupon"."created_at", "item_coupon"."updated_at" from "item_coupon" inner join "item_info" on "item_coupon"."id" = "item_info"."id");