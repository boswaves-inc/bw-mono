CREATE TYPE "public"."user_otp_scope" AS ENUM('verify_account', 'recover_account');
--> statement-breakpoint
CREATE TYPE "public"."user_provider" AS ENUM('internal', 'google');
--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');
--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('deleted', 'pending', 'active');
--> statement-breakpoint
CREATE TYPE "public"."coupon_application" AS ENUM('invoice_amount', 'each_specified_item');
--> statement-breakpoint
CREATE TYPE "public"."coupon_discount" AS ENUM('percentage', 'fixed_amount');
--> statement-breakpoint
CREATE TYPE "public"."coupon_duration" AS ENUM('one_time', 'forever', 'limited_period');
--> statement-breakpoint
CREATE TYPE "public"."email_status" AS ENUM('failed', 'pending', 'processed');
--> statement-breakpoint
CREATE TYPE "public"."item_price_model" AS ENUM('flat_fee', 'per_unit');
--> statement-breakpoint
CREATE TYPE "public"."item_status" AS ENUM('archived', 'deleted', 'active');
--> statement-breakpoint
CREATE TYPE "public"."item_type" AS ENUM('plan', 'charge', 'addon');
--> statement-breakpoint
CREATE TYPE "public"."period_unit" AS ENUM('day', 'week', 'month', 'year');
--> statement-breakpoint
CREATE TYPE "public"."script_type" AS ENUM('library', 'indicator', 'screener', 'strategy');
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"uid" uuid NOT NULL,
	"nonce" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expired_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "session_oauth" (
	"id" uuid PRIMARY KEY NOT NULL,
	"scope" text,
	"provider" "user_provider" NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expired_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"status" "user_status" DEFAULT 'pending' NOT NULL,
	"email" "citext" NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"provider" "user_provider" DEFAULT 'internal' NOT NULL,
	"provider_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_provider_id_unique" UNIQUE("provider_id"),
	CONSTRAINT "users_provider_id_check" CHECK (
		(
			"users"."provider" = 'internal'
			AND "users"."provider_id" IS NULL
		)
		OR (
			"users"."provider" != 'internal'
			AND "users"."provider_id" IS NOT NULL
		)
	)
);
--> statement-breakpoint
CREATE TABLE "user_credentials" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_otps" (
	"id" uuid PRIMARY KEY NOT NULL,
	"uid" uuid NOT NULL,
	"scope" "user_otp_scope" NOT NULL,
	"hash" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"consumed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "carts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"uid" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"quantity" integer NOT NULL,
	"item_price" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
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
	"status" "item_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_discount_check" CHECK (
		(
			discount_type = 'percentage'
			AND discount_percentage IS NOT NULL
		)
		OR (
			discount_type = 'fixed_amount'
			AND discount_currency IS NOT NULL
			AND discount_amount IS NOT NULL
		)
	),
	CONSTRAINT "coupons_valid_check" CHECK (
		(
			valid_from IS NULL
			AND valid_till IS NULL
		)
		OR (
			valid_from IS NOT NULL
			AND valid_till IS NOT NULL
			and valid_till > valid_from
		)
	)
);
--> statement-breakpoint
CREATE TABLE "emails" (
	"id" uuid PRIMARY KEY NOT NULL,
	"sender" text NOT NULL,
	"subject" text NOT NULL,
	"recipient" text NOT NULL,
	"template" uuid,
	"status" "email_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "email_templates" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text GENERATED ALWAYS AS (
		lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
	) STORED NOT NULL,
	"subject" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" "item_type" NOT NULL,
	"name" text NOT NULL,
	"slug" text GENERATED ALWAYS AS (
		lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
	) STORED NOT NULL,
	"excerpt" text NOT NULL,
	"description" text NOT NULL,
	"status" "item_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_prices" (
	"id" uuid PRIMARY KEY NOT NULL,
	"item_id" uuid NOT NULL,
	"price" integer NOT NULL,
	"name" text NOT NULL,
	"period" integer NOT NULL,
	"period_unit" "period_unit" NOT NULL,
	"currency_code" text NOT NULL,
	"pricing_model" "item_price_model" NOT NULL,
	"status" "item_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_scripts" (
	"id" uuid,
	"item_id" uuid,
	"uuid" "citext" NOT NULL,
	"status" "item_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "item_scripts_item_id_id_pk" PRIMARY KEY("item_id", "id")
);
--> statement-breakpoint
CREATE TABLE "item_tags" (
	"id" uuid,
	"item_id" uuid NOT NULL,
	"slug" "citext" NOT NULL,
	"status" "item_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scripts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" "script_type" NOT NULL,
	"name" text NOT NULL,
	"uuid" text NOT NULL,
	"image" text NOT NULL,
	"status" "item_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text GENERATED ALWAYS AS (
		lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
	) STORED NOT NULL,
	"status" "item_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_coupons" (
	"id" uuid PRIMARY KEY NOT NULL,
	"coupon" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupon_codes" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupon_sets" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions"
ADD CONSTRAINT "sessions_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "session_oauth"
ADD CONSTRAINT "session_oauth_id_sessions_id_fk" FOREIGN KEY ("id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "user_credentials"
ADD CONSTRAINT "user_credentials_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "user_otps"
ADD CONSTRAINT "user_otps_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "carts"
ADD CONSTRAINT "carts_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "cart_items"
ADD CONSTRAINT "cart_items_id_carts_id_fk" FOREIGN KEY ("id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "cart_items"
ADD CONSTRAINT "cart_items_item_price_item_prices_id_fk" FOREIGN KEY ("item_price") REFERENCES "public"."item_prices"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "emails"
ADD CONSTRAINT "emails_template_email_templates_id_fk" FOREIGN KEY ("template") REFERENCES "public"."email_templates"("id") ON DELETE
set null ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "item_prices"
ADD CONSTRAINT "item_prices_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "item_scripts"
ADD CONSTRAINT "item_scripts_id_scripts_id_fk" FOREIGN KEY ("id") REFERENCES "public"."scripts"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "item_scripts"
ADD CONSTRAINT "item_scripts_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "item_tags"
ADD CONSTRAINT "item_tags_id_tags_id_fk" FOREIGN KEY ("id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "item_tags"
ADD CONSTRAINT "item_tags_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "cart_coupons"
ADD CONSTRAINT "cart_coupons_id_carts_id_fk" FOREIGN KEY ("id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "cart_coupons"
ADD CONSTRAINT "cart_coupons_coupon_item_prices_id_fk" FOREIGN KEY ("coupon") REFERENCES "public"."item_prices"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
CREATE INDEX "sessions_uid_idx" ON "sessions" USING btree ("uid");
--> statement-breakpoint
CREATE INDEX "sessions_expired_at_idx" ON "sessions" USING btree ("expired_at");
--> statement-breakpoint
CREATE INDEX "session_oauth_uid_idx" ON "session_oauth" USING btree ("id");
--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");
--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");
--> statement-breakpoint
CREATE INDEX "users_provider_id_idx" ON "users" USING btree ("provider", "provider_id");
--> statement-breakpoint
CREATE INDEX "user_credentials_uid_idx" ON "user_credentials" USING btree ("uid");
--> statement-breakpoint
CREATE INDEX "user_otps_uid_type_idx" ON "user_otps" USING btree ("uid", "scope");
--> statement-breakpoint
CREATE INDEX "user_otps_expires_at_idx" ON "user_otps" USING btree ("expires_at");
--> statement-breakpoint
CREATE UNIQUE INDEX "user_otps_active_unique_idx" ON "user_otps" USING btree ("uid", "scope")
WHERE "user_otps"."consumed_at" IS NULL
	AND "user_otps"."revoked_at" IS NULL;
--> statement-breakpoint
CREATE INDEX "cart_uid_idx" ON "carts" USING btree ("uid");
--> statement-breakpoint
CREATE INDEX "cart_item_id_idx" ON "cart_items" USING btree ("id");
--> statement-breakpoint
CREATE INDEX "cart_item_item_price_idx" ON "cart_items" USING btree ("item_price");
--> statement-breakpoint
CREATE UNIQUE INDEX "cart_item_id_item_price_idx" ON "cart_items" USING btree ("id", "item_price");
--> statement-breakpoint
CREATE UNIQUE INDEX "coupons_name_unq" ON "coupons" USING btree ("name")
WHERE status != 'deleted';
--> statement-breakpoint
CREATE INDEX "email_queue_status_idx" ON "emails" USING btree ("status");
--> statement-breakpoint
CREATE INDEX "email_queue_created_at_idx" ON "emails" USING btree ("created_at");
--> statement-breakpoint
CREATE INDEX "emails_slug_idx" ON "email_templates" USING btree ("slug");
--> statement-breakpoint
CREATE UNIQUE INDEX "item_info_slug_unq" ON "items" USING btree ("slug")
WHERE status != 'deleted';
--> statement-breakpoint
CREATE UNIQUE INDEX "item_info_name_unq" ON "items" USING btree ("name")
WHERE status != 'deleted';
--> statement-breakpoint
CREATE UNIQUE INDEX "item_info_id_type_unq" ON "items" USING btree ("id", "type")
WHERE status != 'deleted';
--> statement-breakpoint
CREATE UNIQUE INDEX "item_price_name_unq" ON "item_prices" USING btree ("name")
WHERE status != 'deleted';
--> statement-breakpoint
CREATE UNIQUE INDEX "item_price_item_currency_idx" ON "item_prices" USING btree ("item_id", "currency_code", "period", "period_unit")
WHERE status != 'deleted';
--> statement-breakpoint
CREATE INDEX "item_price_currency_idx" ON "item_prices" USING btree ("currency_code");
--> statement-breakpoint
CREATE INDEX "item_price_item_idx" ON "item_prices" USING btree ("item_id");
--> statement-breakpoint
CREATE INDEX "item_script_uuid_idx" ON "item_scripts" USING btree ("uuid");
--> statement-breakpoint
CREATE INDEX "item_script_item_id_idx" ON "item_scripts" USING btree ("item_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "item_script_uuid_unq" ON "item_scripts" USING btree ("item_id", "uuid");
--> statement-breakpoint
CREATE UNIQUE INDEX "item_script_item_id_unq" ON "item_scripts" USING btree ("uuid", "id");
--> statement-breakpoint
CREATE INDEX "item_tag_id_idx" ON "item_tags" USING btree ("id");
--> statement-breakpoint
CREATE INDEX "item_tag_slug_idx" ON "item_tags" USING btree ("slug");
--> statement-breakpoint
CREATE INDEX "item_tag_item_id_idx" ON "item_tags" USING btree ("item_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "item_tag_item_id_unq" ON "item_tags" USING btree ("item_id")
WHERE status != 'deleted';
--> statement-breakpoint
CREATE UNIQUE INDEX "item_tag_item_slug_unq" ON "item_tags" USING btree ("item_id", "slug")
WHERE status != 'deleted';
--> statement-breakpoint
CREATE INDEX "script_status_idx" ON "scripts" USING btree ("status");
--> statement-breakpoint
CREATE UNIQUE INDEX "script_uuid_unq" ON "scripts" USING btree ("uuid")
WHERE status != 'deleted';
--> statement-breakpoint
CREATE INDEX "tag_info_status_idx" ON "tags" USING btree ("status");
--> statement-breakpoint
CREATE UNIQUE INDEX "tag_info_slug_unq" ON "tags" USING btree ("slug")
WHERE status != 'deleted';
--> statement-breakpoint
CREATE INDEX "cart_coupon_id_idx" ON "cart_coupons" USING btree ("id");
--> statement-breakpoint
CREATE INDEX "cart_coupon_item_price_idx" ON "cart_coupons" USING btree ("coupon");
--> statement-breakpoint
CREATE UNIQUE INDEX "cart_coupon_id_item_price_idx" ON "cart_coupons" USING btree ("id", "coupon");
