DROP MATERIALIZED VIEW "public"."coupon_data";--> statement-breakpoint
ALTER TABLE "item_coupon" RENAME TO "item_coupon_price";--> statement-breakpoint
ALTER TABLE "item_coupon_price" DROP CONSTRAINT "item_coupon_id_item_info_id_fk";
--> statement-breakpoint
ALTER TABLE "item_coupon_price" ADD CONSTRAINT "item_coupon_price_id_item_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."coupon_data" AS (select "item_info"."id", "item_info"."name", "item_info"."status", "item_coupon_price"."type", "item_coupon_price"."value", "item_coupon_price"."apply_on", "item_info"."created_at", "item_info"."updated_at", "item_info"."archived_at" from "item_coupon_price" inner join "item_info" on "item_coupon_price"."id" = "item_info"."id");