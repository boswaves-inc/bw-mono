CREATE TYPE "public"."coupon_application" AS ENUM('invoice_amount', 'each_specified_item');--> statement-breakpoint
CREATE TYPE "public"."coupon_discount" AS ENUM('percentage', 'fixed_amount');--> statement-breakpoint
CREATE TYPE "public"."coupon_duration" AS ENUM('one_time', 'forever', 'limited_period');--> statement-breakpoint
CREATE TYPE "public"."item_type" AS ENUM('plan', 'charge', 'addon');--> statement-breakpoint
CREATE TYPE "public"."constraint_type" AS ENUM('none', 'all', 'specific', 'criteria');--> statement-breakpoint
CREATE TYPE "public"."period_unit" AS ENUM('day', 'week', 'month', 'year');--> statement-breakpoint
CREATE TYPE "public"."pricing_model" AS ENUM('flat_fee', 'per_unit');--> statement-breakpoint
CREATE TYPE "public"."script_type" AS ENUM('library', 'indicator', 'screener', 'strategy');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('archived', 'deleted', 'active');--> statement-breakpoint
CREATE TYPE "public"."user_provider" AS ENUM('internal', 'google');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "cart" (
	"id" uuid PRIMARY KEY NOT NULL,
	"uid" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_coupon" (
	"id" uuid PRIMARY KEY NOT NULL,
	"coupon" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_item" (
	"id" uuid PRIMARY KEY NOT NULL,
	"quantity" integer NOT NULL,
	"item_price" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupon" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text GENERATED ALWAYS AS (lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))) STORED NOT NULL,
	"status" "status" NOT NULL,
	"apply_on" "coupon_application" NOT NULL,
	"period" integer,
	"period_unit" "period_unit",
	"duration_type" "coupon_duration" NOT NULL,
	"discount_type" "coupon_discount" NOT NULL,
	"discount_amount" integer,
	"discount_currency" text,
	"discount_percentage" double precision,
	"valid_from" timestamp with time zone,
	"valid_till" timestamp with time zone,
	"max_redemptions" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "coupon_info_discount_check" CHECK ((discount_type = 'percentage' AND discount_percentage IS NOT NULL) OR (discount_type = 'fixed_amount' AND discount_currency IS NOT NULL AND discount_amount IS NOT NULL)),
	CONSTRAINT "coupon_info_valid_check" CHECK ((valid_from IS NULL AND valid_till IS NULL) OR (valid_from IS NOT NULL AND valid_till IS NOT NULL and valid_till > valid_from))
);
--> statement-breakpoint
CREATE TABLE "item" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" "item_type" NOT NULL,
	"name" text NOT NULL,
	"slug" text GENERATED ALWAYS AS (lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))) STORED NOT NULL,
	"description" text NOT NULL,
	"status" "status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_price" (
	"id" uuid PRIMARY KEY NOT NULL,
	"item_id" uuid NOT NULL,
	"price" integer NOT NULL,
	"name" text NOT NULL,
	"period" integer NOT NULL,
	"period_unit" "period_unit" NOT NULL,
	"currency_code" text NOT NULL,
	"pricing_model" "pricing_model" NOT NULL,
	"status" "status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_script" (
	"id" uuid,
	"item_id" uuid,
	"uuid" "citext" NOT NULL,
	"status" "status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "item_script_item_id_id_pk" PRIMARY KEY("item_id","id")
);
--> statement-breakpoint
CREATE TABLE "item_tag" (
	"id" uuid,
	"item_id" uuid NOT NULL,
	"slug" "citext" NOT NULL,
	"status" "status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "script" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" "script_type" NOT NULL,
	"name" text NOT NULL,
	"uuid" text NOT NULL,
	"image" text NOT NULL,
	"status" "status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text GENERATED ALWAYS AS (lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))) STORED NOT NULL,
	"status" "status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"cbid" text NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"email" "citext" NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"provider" "user_provider" DEFAULT 'internal' NOT NULL,
	"provider_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_provider_id_unique" UNIQUE("provider_id")
);
--> statement-breakpoint
CREATE TABLE "user_credentials" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_uid_user_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."user"("uid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_coupon" ADD CONSTRAINT "cart_coupon_id_cart_id_fk" FOREIGN KEY ("id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_coupon" ADD CONSTRAINT "cart_coupon_coupon_item_price_id_fk" FOREIGN KEY ("coupon") REFERENCES "public"."item_price"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_id_cart_id_fk" FOREIGN KEY ("id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_item_price_item_price_id_fk" FOREIGN KEY ("item_price") REFERENCES "public"."item_price"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_price" ADD CONSTRAINT "item_price_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_script" ADD CONSTRAINT "item_script_id_script_id_fk" FOREIGN KEY ("id") REFERENCES "public"."script"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_script" ADD CONSTRAINT "item_script_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_tag" ADD CONSTRAINT "item_tag_id_tag_id_fk" FOREIGN KEY ("id") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_tag" ADD CONSTRAINT "item_tag_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_uid_user_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."user"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cart_uid_idx" ON "cart" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "cart_coupon_id_idx" ON "cart_coupon" USING btree ("id");--> statement-breakpoint
CREATE INDEX "cart_coupon_item_price_idx" ON "cart_coupon" USING btree ("coupon");--> statement-breakpoint
CREATE UNIQUE INDEX "cart_coupon_id_item_price_idx" ON "cart_coupon" USING btree ("id","coupon");--> statement-breakpoint
CREATE INDEX "cart_item_id_idx" ON "cart_item" USING btree ("id");--> statement-breakpoint
CREATE INDEX "cart_item_item_price_idx" ON "cart_item" USING btree ("item_price");--> statement-breakpoint
CREATE UNIQUE INDEX "cart_item_id_item_price_idx" ON "cart_item" USING btree ("id","item_price");--> statement-breakpoint
CREATE UNIQUE INDEX "coupon_info_idx_unq" ON "coupon" USING btree ("id") WHERE status != 'deleted';--> statement-breakpoint
CREATE UNIQUE INDEX "coupon_info_name_unq" ON "coupon" USING btree ("name") WHERE status != 'deleted';--> statement-breakpoint
CREATE UNIQUE INDEX "coupon_info_slug_unq" ON "coupon" USING btree ("slug") WHERE status != 'deleted';--> statement-breakpoint
CREATE UNIQUE INDEX "item_info_slug_unq" ON "item" USING btree ("slug") WHERE status != 'deleted';--> statement-breakpoint
CREATE UNIQUE INDEX "item_info_name_unq" ON "item" USING btree ("name") WHERE status != 'deleted';--> statement-breakpoint
CREATE UNIQUE INDEX "item_info_id_type_unq" ON "item" USING btree ("id","type") WHERE status != 'deleted';--> statement-breakpoint
CREATE UNIQUE INDEX "item_price_name_unq" ON "item_price" USING btree ("name") WHERE status != 'deleted';--> statement-breakpoint
CREATE UNIQUE INDEX "item_price_item_currency_idx" ON "item_price" USING btree ("item_id","currency_code","period","period_unit") WHERE status != 'deleted';--> statement-breakpoint
CREATE INDEX "item_price_currency_idx" ON "item_price" USING btree ("currency_code");--> statement-breakpoint
CREATE INDEX "item_price_item_idx" ON "item_price" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "item_script_uuid_idx" ON "item_script" USING btree ("uuid");--> statement-breakpoint
CREATE INDEX "item_script_item_id_idx" ON "item_script" USING btree ("item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "item_script_uuid_unq" ON "item_script" USING btree ("item_id","uuid");--> statement-breakpoint
CREATE UNIQUE INDEX "item_script_item_id_unq" ON "item_script" USING btree ("uuid","id");--> statement-breakpoint
CREATE INDEX "item_tag_id_idx" ON "item_tag" USING btree ("id");--> statement-breakpoint
CREATE INDEX "item_tag_slug_idx" ON "item_tag" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "item_tag_item_id_idx" ON "item_tag" USING btree ("item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "item_tag_item_id_unq" ON "item_tag" USING btree ("item_id") WHERE status != 'deleted';--> statement-breakpoint
CREATE UNIQUE INDEX "item_tag_item_slug_unq" ON "item_tag" USING btree ("item_id","slug") WHERE status != 'deleted';--> statement-breakpoint
CREATE INDEX "script_status_idx" ON "script" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "script_uuid_unq" ON "script" USING btree ("uuid") WHERE status != 'deleted';--> statement-breakpoint
CREATE INDEX "tag_info_status_idx" ON "tag" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "tag_info_slug_unq" ON "tag" USING btree ("slug") WHERE status != 'deleted';