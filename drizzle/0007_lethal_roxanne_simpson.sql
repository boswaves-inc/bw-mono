ALTER TABLE "coupon_info" RENAME TO "item_coupon";--> statement-breakpoint
ALTER TABLE "item_coupon" DROP CONSTRAINT "coupon_info_title_unique";--> statement-breakpoint
ALTER TABLE "item_coupon" ADD CONSTRAINT "item_coupon_id_item_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_coupon" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "item_coupon" DROP COLUMN "status";--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."coupon_info" AS (select "item_info"."id", "item_coupon"."type", "item_info"."name", "item_info"."status", "item_coupon"."created_at", "item_coupon"."updated_at" from "item_coupon" inner join "item_info" on "item_coupon"."id" = "item_info"."id");