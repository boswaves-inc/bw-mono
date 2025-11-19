CREATE TYPE "public"."item_type" AS ENUM('plan', 'coupon', 'charge', 'addon');--> statement-breakpoint
CREATE TYPE "public"."coupon_application" AS ENUM('invoice', 'item');--> statement-breakpoint
CREATE TYPE "public"."coupon_duration" AS ENUM('one_time', 'forever', 'limited_period');--> statement-breakpoint
CREATE TYPE "public"."coupon_type" AS ENUM('fixed', 'percentage');--> statement-breakpoint
CREATE TYPE "public"."period_unit" AS ENUM('day', 'week', 'month', 'year');--> statement-breakpoint
CREATE TYPE "public"."price_model" AS ENUM('flat_fee', 'per_unit');--> statement-breakpoint
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
	"cart_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"item_type" "item_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cart_item_cart_id_item_id_pk" PRIMARY KEY("cart_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "item_info" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" "item_type" NOT NULL,
	"name" text NOT NULL,
	"slug" text GENERATED ALWAYS AS (lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))) STORED NOT NULL,
	"status" "status" DEFAULT 'archived' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"archived_at" timestamp,
	CONSTRAINT "item_info_name_unique" UNIQUE("name"),
	CONSTRAINT "item_info_slug_unique" UNIQUE("slug")
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
	"id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"price" integer NOT NULL,
	"period_unit" "period_unit" NOT NULL,
	"pricing_model" "price_model" NOT NULL,
	"currency_code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"archived_at" timestamp,
	CONSTRAINT "item_price_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "item_script" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" "script_type" NOT NULL,
	"uuid" text NOT NULL,
	"image" text NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "item_script_uuid_unique" UNIQUE("uuid")
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
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_cart_info_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_item_id_item_info_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_coupon" ADD CONSTRAINT "item_coupon_id_item_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_price" ADD CONSTRAINT "item_price_item_id_item_info_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_script" ADD CONSTRAINT "item_script_id_item_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_uid_user_info_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."user_info"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "item_info_slug_idx" ON "item_info" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "item_price_item_idx" ON "item_price" USING btree ("currency_code");--> statement-breakpoint
CREATE INDEX "item_price_currency_idx" ON "item_price" USING btree ("currency_code");--> statement-breakpoint
CREATE INDEX "item_price_item_currency_idx" ON "item_price" USING btree ("item_id","currency_code");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."coupon_data" AS (select "item_info"."id", "item_info"."name", "item_info"."status", "item_coupon"."type", "item_coupon"."value", "item_coupon"."apply_on", "item_info"."created_at", "item_info"."updated_at", "item_info"."archived_at" from "item_coupon" inner join "item_info" on "item_coupon"."id" = "item_info"."id");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."plan_data" AS (select "item_info"."id", "item_info"."name", "item_info"."slug", "item_info"."status", json_build_object('id', "item_script"."id") as "script", json_agg(json_build_object('id', "item_price"."id")) as "prices", "item_info"."created_at", "item_info"."updated_at", "item_info"."archived_at" from "item_info" left join "item_script" on "item_script"."id" = "item_info"."id" left join "item_price" on "item_price"."id" = "item_info"."id" group by "item_info"."id", "item_script"."id");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."script_data" AS (select "item_info"."id", "item_script"."uuid", "item_script"."type", "item_info"."name", "item_info"."slug", "item_info"."status", "item_script"."image", "item_script"."description", "item_info"."created_at", "item_info"."updated_at", "item_info"."archived_at" from "item_script" inner join "item_info" on "item_script"."id" = "item_info"."id");