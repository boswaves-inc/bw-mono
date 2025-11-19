ALTER MATERIALIZED VIEW "public"."charge_data" RENAME TO "item_charge_data";--> statement-breakpoint
ALTER MATERIALIZED VIEW "public"."coupon_data" RENAME TO "item_coupon_data";--> statement-breakpoint
ALTER TABLE "charge_price" RENAME TO "item_charge_price";--> statement-breakpoint
ALTER TABLE "plan_price" RENAME TO "item_plan_price";--> statement-breakpoint
ALTER TABLE "item_charge_price" DROP CONSTRAINT "charge_price_id_item_info_id_fk";
--> statement-breakpoint
ALTER TABLE "item_plan_price" DROP CONSTRAINT "plan_price_id_item_info_id_fk";
--> statement-breakpoint
ALTER TABLE "item_charge_price" DROP CONSTRAINT "charge_price_uuid_pk";--> statement-breakpoint
ALTER TABLE "item_plan_price" DROP CONSTRAINT "plan_price_uuid_pk";--> statement-breakpoint
ALTER TABLE "item_charge_price" ADD CONSTRAINT "item_charge_price_uuid_pk" PRIMARY KEY("uuid");--> statement-breakpoint
ALTER TABLE "item_plan_price" ADD CONSTRAINT "item_plan_price_uuid_pk" PRIMARY KEY("uuid");--> statement-breakpoint
ALTER TABLE "item_charge_price" ADD CONSTRAINT "item_charge_price_id_item_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_plan_price" ADD CONSTRAINT "item_plan_price_id_item_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint