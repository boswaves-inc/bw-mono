DROP VIEW "public"."cart_data";--> statement-breakpoint
DROP MATERIALIZED VIEW "public"."charge_data";--> statement-breakpoint
DROP MATERIALIZED VIEW "public"."coupon_data";--> statement-breakpoint
DROP MATERIALIZED VIEW "public"."plan_data";--> statement-breakpoint
ALTER TABLE "item_info" RENAME TO "item";--> statement-breakpoint
ALTER TABLE "item" DROP CONSTRAINT "item_info_name_unique";--> statement-breakpoint
ALTER TABLE "item" DROP CONSTRAINT "item_info_slug_unique";--> statement-breakpoint
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_item_item_info_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_item_type_item_info_id_type_fk";
--> statement-breakpoint
ALTER TABLE "item_charge_price" DROP CONSTRAINT "item_charge_price_id_item_info_id_fk";
--> statement-breakpoint
ALTER TABLE "item_coupon_price" DROP CONSTRAINT "item_coupon_price_id_item_info_id_fk";
--> statement-breakpoint
ALTER TABLE "item_plan_script" DROP CONSTRAINT "item_plan_script_id_item_info_id_fk";
--> statement-breakpoint
ALTER TABLE "item_plan_price" DROP CONSTRAINT "item_plan_price_id_item_info_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_item_item_id_fk" FOREIGN KEY ("item") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_item_type_item_id_type_fk" FOREIGN KEY ("item","type") REFERENCES "public"."item"("id","type") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_charge_price" ADD CONSTRAINT "item_charge_price_id_item_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_coupon_price" ADD CONSTRAINT "item_coupon_price_id_item_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_plan_script" ADD CONSTRAINT "item_plan_script_id_item_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_plan_price" ADD CONSTRAINT "item_plan_price_id_item_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_slug_unique" UNIQUE("slug");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."charge_data" AS (select "item"."id", "item"."name", "item"."status", json_agg(json_build_object('id', "item_charge_price"."id", 'uuid', "item_charge_price"."uuid", 'price', "item_charge_price"."price", 'pricing_model', "item_charge_price"."pricing_model", 'currency_code', "item_charge_price"."currency_code", 'created_at', "item_charge_price"."created_at", 'updated_at', "item_charge_price"."updated_at", 'archived_at', "item_charge_price"."archived_at")) as "prices", "item"."created_at", "item"."updated_at", "item"."archived_at" from "item" left join "item_charge_price" on "item_charge_price"."id" = "item"."id" where "item"."type" = 'charge' group by "item"."id");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."coupon_data" AS (select "item"."id", "item"."name", "item"."status", "item_coupon_price"."type", "item_coupon_price"."value", "item_coupon_price"."apply_on", "item"."created_at", "item"."updated_at", "item"."archived_at" from "item_coupon_price" inner join "item" on "item_coupon_price"."id" = "item"."id");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."plan_data" AS (select "item"."id", "item"."name", "item"."type", "item"."slug", "item"."status", json_build_object('id', "item_plan_script"."id", 'uuid', "item_plan_script"."uuid", 'type', "item_plan_script"."type", 'image', "item_plan_script"."image", 'description', "item_plan_script"."description") as "script", json_agg(json_build_object('id', "item_plan_price"."id", 'uuid', "item_plan_price"."uuid", 'price', "item_plan_price"."price", 'period_unit', "item_plan_price"."period_unit", 'pricing_model', "item_plan_price"."pricing_model", 'currency_code', "item_plan_price"."currency_code", 'created_at', "item_plan_price"."created_at", 'updated_at', "item_plan_price"."updated_at", 'archived_at', "item_plan_price"."archived_at")) as "prices", "item"."created_at", "item"."updated_at", "item"."archived_at" from "item" left join "item_plan_script" on "item_plan_script"."id" = "item"."id" left join "item_plan_price" on "item_plan_price"."id" = "item"."id" where "item"."type" = 'plan' group by "item"."id", "item_plan_script"."id");