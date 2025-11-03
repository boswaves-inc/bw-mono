CREATE TYPE "public"."item_type" AS ENUM('script');--> statement-breakpoint
CREATE TYPE "public"."period_unit" AS ENUM('day', 'week', 'month', 'year');--> statement-breakpoint
CREATE TABLE "item_info" (
	"id" uuid PRIMARY KEY NOT NULL,
	"price" numeric,
	"currncy" text,
	"period" "period_unit" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_price" (
	"id" uuid PRIMARY KEY NOT NULL,
	"price" numeric,
	"currncy" text,
	"period" "period_unit" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "item_price" ADD CONSTRAINT "item_price_id_item_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;