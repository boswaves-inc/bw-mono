DROP MATERIALIZED VIEW "public"."coupon_info";--> statement-breakpoint
DROP MATERIALIZED VIEW "public"."script_info";--> statement-breakpoint
ALTER TABLE "item_info" ADD COLUMN "archived_at" timestamp;--> statement-breakpoint
ALTER TABLE "item_coupon" ADD COLUMN "value" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "item_coupon" DROP COLUMN "amount";--> statement-breakpoint
ALTER TABLE "item_coupon" DROP COLUMN "percentage";--> statement-breakpoint
ALTER TABLE "item_coupon" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "item_coupon" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "item_script" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "item_script" DROP COLUMN "updated_at";--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."coupon_info" AS (select "item_info"."id", "item_info"."name", "item_info"."status", "item_coupon"."type", "item_coupon"."value", "item_coupon"."apply_on", "item_info"."created_at", "item_info"."updated_at" from "item_coupon" inner join "item_info" on "item_coupon"."id" = "item_info"."id");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."script_info" AS (select "item_info"."id", "item_script"."uuid", "item_script"."type", "item_info"."name", "item_info"."status", "item_info"."created_at", "item_info"."updated_at" from "item_script" inner join "item_info" on "item_script"."id" = "item_info"."id");