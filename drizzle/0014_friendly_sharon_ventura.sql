CREATE TABLE "charge_price" (
	"id" uuid NOT NULL,
	"uuid" uuid NOT NULL,
	"price" integer NOT NULL,
	"pricing_model" "pricing_model" NOT NULL,
	"currency_code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"archived_at" timestamp,
	CONSTRAINT "charge_price_uuid_pk" PRIMARY KEY("uuid")
);
--> statement-breakpoint
DROP MATERIALIZED VIEW "public"."charge_data";--> statement-breakpoint
DROP INDEX "item_price_item_idx";--> statement-breakpoint
DROP INDEX "item_price_currency_idx";--> statement-breakpoint
DROP INDEX "item_price_item_currency_idx";--> statement-breakpoint
ALTER TABLE "charge_price" ADD CONSTRAINT "charge_price_id_item_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "charge_price_item_idx" ON "charge_price" USING btree ("currency_code");--> statement-breakpoint
CREATE INDEX "charge_price_currency_idx" ON "charge_price" USING btree ("currency_code");--> statement-breakpoint
CREATE INDEX "charge_price_item_currency_idx" ON "charge_price" USING btree ("id","currency_code");--> statement-breakpoint
CREATE INDEX "plan_price_item_idx" ON "plan_price" USING btree ("currency_code");--> statement-breakpoint
CREATE INDEX "plan_price_currency_idx" ON "plan_price" USING btree ("currency_code");--> statement-breakpoint
CREATE INDEX "plan_price_item_currency_idx" ON "plan_price" USING btree ("id","currency_code");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."charge_data" AS (select "item_info"."id", "item_info"."name", "item_info"."status", json_agg(json_build_object('id', "charge_price"."id", 'uuid', "charge_price"."uuid", 'price', "charge_price"."price", 'pricing_model', "charge_price"."pricing_model", 'currency_code', "charge_price"."currency_code", 'created_at', "charge_price"."created_at", 'updated_at', "charge_price"."updated_at", 'archived_at', "charge_price"."archived_at")) as "prices", "item_info"."created_at", "item_info"."updated_at", "item_info"."archived_at" from "item_info" left join "charge_price" on "charge_price"."id" = "item_info"."id" where "item_info"."type" = 'charge' group by "item_info"."id");