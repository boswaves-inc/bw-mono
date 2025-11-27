CREATE TYPE "public"."item_type" AS ENUM('plan', 'coupon', 'charge', 'addon');--> statement-breakpoint
CREATE TYPE "public"."coupon_application" AS ENUM('invoice', 'item');--> statement-breakpoint
CREATE TYPE "public"."coupon_duration" AS ENUM('one_time', 'forever', 'limited_period');--> statement-breakpoint
CREATE TYPE "public"."coupon_type" AS ENUM('fixed', 'percentage');--> statement-breakpoint
CREATE TYPE "public"."period_unit" AS ENUM('day', 'week', 'month', 'year');--> statement-breakpoint
CREATE TYPE "public"."pricing_model" AS ENUM('flat_fee', 'per_unit');--> statement-breakpoint
CREATE TYPE "public"."script_type" AS ENUM('library', 'indicator', 'screener', 'strategy');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('archived', 'deleted', 'active');--> statement-breakpoint
CREATE TYPE "public"."user_provider" AS ENUM('internal', 'google');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "cart_info" (
	"id" uuid PRIMARY KEY NOT NULL,
	"uid" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_item" (
	"id" uuid NOT NULL,
	"type" "item_type" NOT NULL,
	"item" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cart_item_id_item_pk" PRIMARY KEY("id","item")
);
--> statement-breakpoint
CREATE TABLE "item" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" "item_type" NOT NULL,
	"name" text NOT NULL,
	"slug" text GENERATED ALWAYS AS (lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))) STORED NOT NULL,
	"status" "status" DEFAULT 'archived' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"archived_at" timestamp,
	CONSTRAINT "item_name_unique" UNIQUE("name"),
	CONSTRAINT "item_slug_unique" UNIQUE("slug"),
	CONSTRAINT "item_info_id_type_unq" UNIQUE("id","type")
);
--> statement-breakpoint
CREATE TABLE "item_charge" (
	"id" uuid NOT NULL,
	"uuid" uuid NOT NULL,
	"price" integer NOT NULL,
	"status" "status" NOT NULL,
	"pricing_model" "pricing_model" NOT NULL,
	"currency_code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "item_charge_uuid_pk" PRIMARY KEY("uuid")
);
--> statement-breakpoint
CREATE TABLE "item_coupon" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" "coupon_type" NOT NULL,
	"value" double precision NOT NULL,
	"apply_on" "coupon_application" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_price" (
	"id" uuid PRIMARY KEY NOT NULL,
	"item_id" uuid NOT NULL,
	"price" integer NOT NULL,
	"period_unit" "period_unit" NOT NULL,
	"currency_code" text NOT NULL,
	"pricing_model" "pricing_model" NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_script" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" "script_type" NOT NULL,
	"uuid" text NOT NULL,
	"image" text NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "item_script_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "item_script_uuid_unq" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "user_info" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"cbid" text NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"email" "citext" NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"provider" "user_provider" DEFAULT 'internal' NOT NULL,
	"provider_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_info_email_unique" UNIQUE("email"),
	CONSTRAINT "user_info_provider_id_unique" UNIQUE("provider_id")
);
--> statement-breakpoint
CREATE TABLE "user_credentials" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cart_info" ADD CONSTRAINT "cart_info_uid_user_info_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."user_info"("uid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_id_cart_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."cart_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_item_item_id_fk" FOREIGN KEY ("item") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_item_type_item_id_type_fk" FOREIGN KEY ("item","type") REFERENCES "public"."item"("id","type") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_charge" ADD CONSTRAINT "item_charge_id_item_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_coupon" ADD CONSTRAINT "item_coupon_id_item_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_price" ADD CONSTRAINT "item_price_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_script" ADD CONSTRAINT "item_script_id_item_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_uid_user_info_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."user_info"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "item_info_slug_idx" ON "item" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "charge_price_item_idx" ON "item_charge" USING btree ("currency_code");--> statement-breakpoint
CREATE INDEX "charge_price_currency_idx" ON "item_charge" USING btree ("currency_code");--> statement-breakpoint
CREATE INDEX "charge_price_item_currency_idx" ON "item_charge" USING btree ("id","currency_code");--> statement-breakpoint
CREATE INDEX "plan_price_item_idx" ON "item_price" USING btree ("id","item_id");--> statement-breakpoint
CREATE INDEX "plan_price_currency_idx" ON "item_price" USING btree ("currency_code");--> statement-breakpoint
CREATE INDEX "plan_price_item_currency_idx" ON "item_price" USING btree ("item_id","currency_code");--> statement-breakpoint
CREATE INDEX "item_script_uuid_idx" ON "item_script" USING btree ("uuid");--> statement-breakpoint
CREATE INDEX "item_script_id_idx" ON "item_script" USING btree ("id");--> statement-breakpoint
CREATE VIEW "public"."cart_data" AS (select "cart_info"."id", "cart_info"."uid", json_agg(json_build_object('id', "item"."id", 'name', "item"."name", 'type', "item"."type", 'slug', "item"."slug", 'status', "item"."status", 'created_at', "item"."created_at", 'updated_at', "item"."updated_at", 'archived_at', "item"."archived_at")) as "items" from "cart_info" left join "cart_item" on "cart_info"."id" = "cart_item"."id" inner join "item" on "cart_item"."item" = "item"."id" group by "cart_info"."id");