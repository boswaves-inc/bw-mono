CREATE TYPE "public"."coupon_application" AS ENUM('invoice', 'item');--> statement-breakpoint
CREATE TYPE "public"."coupon_duration" AS ENUM('one_time', 'forever', 'limited_period');--> statement-breakpoint
DROP MATERIALIZED VIEW "public"."coupon_info";--> statement-breakpoint
ALTER TABLE "item_coupon" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."coupon_type";--> statement-breakpoint
CREATE TYPE "public"."coupon_type" AS ENUM('fixed', 'quantity', 'percentage');--> statement-breakpoint
ALTER TABLE "item_coupon" ALTER COLUMN "type" SET DATA TYPE "public"."coupon_type" USING "type"::"public"."coupon_type";--> statement-breakpoint
ALTER TABLE "item_coupon" ADD COLUMN "apply_on" "coupon_application" NOT NULL;--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."coupon_info" AS (select "item_info"."id", "item_info"."name", "item_info"."status", "item_coupon"."type", "item_coupon"."apply_on", "item_coupon"."created_at", "item_coupon"."updated_at" from "item_coupon" inner join "item_info" on "item_coupon"."id" = "item_info"."id");