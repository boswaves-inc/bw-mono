CREATE TYPE "public"."coupon_application" AS ENUM('invoice', 'item');--> statement-breakpoint
CREATE TYPE "public"."coupon_duration" AS ENUM('one_time', 'forever', 'limited_period');--> statement-breakpoint
CREATE TYPE "public"."coupon_type" AS ENUM('fixed', 'percentage');--> statement-breakpoint
CREATE TYPE "public"."script_type" AS ENUM('library', 'indicator', 'screener', 'strategy');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('archived', 'public');--> statement-breakpoint
CREATE TYPE "public"."user_provider" AS ENUM('internal', 'google');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "item_info" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"status" "status" DEFAULT 'archived' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"archived_at" timestamp,
	CONSTRAINT "item_info_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "item_coupon" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" "coupon_type" NOT NULL,
	"value" double precision NOT NULL,
	"apply_on" "coupon_application" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_script" (
	"id" uuid PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"type" "script_type" NOT NULL,
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
ALTER TABLE "item_coupon" ADD CONSTRAINT "item_coupon_id_item_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_script" ADD CONSTRAINT "item_script_id_item_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_uid_user_info_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."user_info"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."coupon_info" AS (select "item_info"."id", "item_info"."name", "item_info"."status", "item_coupon"."type", "item_coupon"."value", "item_coupon"."apply_on", "item_info"."created_at", "item_info"."updated_at", "item_info"."archived_at" from "item_coupon" inner join "item_info" on "item_coupon"."id" = "item_info"."id");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."script_info" AS (select "item_info"."id", "item_script"."uuid", "item_script"."type", "item_info"."name", "item_info"."status", "item_script"."description", "item_info"."created_at", "item_info"."updated_at", "item_info"."archived_at" from "item_script" inner join "item_info" on "item_script"."id" = "item_info"."id");