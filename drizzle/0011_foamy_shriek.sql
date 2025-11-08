CREATE TYPE "public"."item_type" AS ENUM('script', 'coupon');--> statement-breakpoint
ALTER TABLE "item_info" ADD COLUMN "type" "item_type" DEFAULT 'script' NOT NULL;