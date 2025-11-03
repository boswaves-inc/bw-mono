CREATE TYPE "public"."user_provider" AS ENUM('internal', 'google');--> statement-breakpoint
CREATE TABLE "cart_info" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"promo_code" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" varchar(255) NOT NULL,
	"uid" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "cart_items_id_uid_pk" PRIMARY KEY("id","uid")
);
--> statement-breakpoint
CREATE TABLE "user_info" (
	"uid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"provider" "user_provider" DEFAULT 'internal' NOT NULL,
	"provider_id" varchar(255),
	"chargebee_id" varchar(255) NOT NULL,
	"tradingview_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_info_email_unique" UNIQUE("email"),
	CONSTRAINT "user_info_provider_id_unique" UNIQUE("provider_id"),
	CONSTRAINT "user_info_chargebee_id_unique" UNIQUE("chargebee_id"),
	CONSTRAINT "user_info_tradingview_id_unique" UNIQUE("tradingview_id")
);
--> statement-breakpoint
CREATE TABLE "user_credentials" (
	"uid" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cart_info" ADD CONSTRAINT "cart_info_uid_user_info_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."user_info"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_uid_cart_info_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."cart_info"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_uid_user_info_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."user_info"("uid") ON DELETE no action ON UPDATE no action;