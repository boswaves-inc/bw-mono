CREATE TYPE "public"."coupon_type" AS ENUM('invoice', 'item');--> statement-breakpoint
CREATE TABLE "coupon_info" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" "coupon_type" NOT NULL,
	"status" "status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coupon_info_title_unique" UNIQUE("title")
);
