DROP MATERIALIZED VIEW "public"."plan_data";--> statement-breakpoint
ALTER TABLE "cart_item" RENAME COLUMN "cart_id" TO "id";--> statement-breakpoint
ALTER TABLE "cart_item" RENAME COLUMN "item_id" TO "item";--> statement-breakpoint
ALTER TABLE "cart_item" RENAME COLUMN "item_type" TO "type";--> statement-breakpoint
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_cart_id_cart_info_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_item_id_item_info_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_cart_id_item_id_pk";--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_id_item_pk" PRIMARY KEY("id","item");--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_id_cart_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."cart_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_item_item_info_id_fk" FOREIGN KEY ("item") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_info" ADD CONSTRAINT "item_info_id_type_unq" UNIQUE("id","type");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."plan_data" AS (select "item_info"."id", "item_info"."name", "item_info"."type", "item_info"."slug", "item_info"."status", json_build_object('id', "item_script"."id", 'uuid', "item_script"."uuid", 'type', "item_script"."type", 'image', "item_script"."image", 'description', "item_script"."description") as "script", json_agg(json_build_object('id', "item_price"."id", 'uuid', "item_price"."uuid", 'price', "item_price"."price", 'period_unit', "item_price"."period_unit", 'pricing_model', "item_price"."pricing_model", 'currency_code', "item_price"."currency_code", 'created_at', "item_price"."created_at", 'updated_at', "item_price"."updated_at", 'archived_at', "item_price"."archived_at")) as "prices", "item_info"."created_at", "item_info"."updated_at", "item_info"."archived_at" from "item_info" left join "item_script" on "item_script"."id" = "item_info"."id" left join "item_price" on "item_price"."id" = "item_info"."id" where "item_info"."type" = 'plan' group by "item_info"."id", "item_script"."id");