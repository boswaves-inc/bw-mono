DROP MATERIALIZED VIEW "public"."plan_data";--> statement-breakpoint
ALTER TABLE "item_price" DROP CONSTRAINT "item_price_item_id_item_info_id_fk";
--> statement-breakpoint
DROP INDEX "item_price_item_currency_idx";--> statement-breakpoint
ALTER TABLE "item_price" DROP CONSTRAINT "item_price_id_pk";--> statement-breakpoint
ALTER TABLE "item_price" ADD CONSTRAINT "item_price_uuid_pk" PRIMARY KEY("uuid");--> statement-breakpoint
ALTER TABLE "item_price" ADD CONSTRAINT "item_price_id_item_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "item_price_item_currency_idx" ON "item_price" USING btree ("id","currency_code");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."plan_data" AS (select "item_info"."id", "item_info"."name", "item_info"."slug", "item_info"."status", json_build_object('id', "item_script"."id") as "script", json_agg(json_build_object('id', "item_price"."uuid")) as "prices", "item_info"."created_at", "item_info"."updated_at", "item_info"."archived_at" from "item_info" left join "item_script" on "item_script"."id" = "item_info"."id" left join "item_price" on "item_price"."id" = "item_info"."id" group by "item_info"."id", "item_script"."id");