ALTER MATERIALIZED VIEW "public"."coupon_info" RENAME TO "coupon_data";--> statement-breakpoint
ALTER MATERIALIZED VIEW "public"."script_info" RENAME TO "script_data";--> statement-breakpoint
ALTER TABLE "cart_item" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "cart_item" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."cart_data" AS (select "id", "uid", "created_at" from "cart_info");