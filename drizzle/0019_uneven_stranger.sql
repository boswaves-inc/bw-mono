CREATE TYPE "public"."coupon_application" AS ENUM('invoice', 'item');--> statement-breakpoint
CREATE TYPE "public"."coupon_constraint" AS ENUM('none', 'all', 'specific', 'criteria');--> statement-breakpoint
CREATE TYPE "public"."coupon_duration" AS ENUM('one_time', 'forever', 'limited_period');--> statement-breakpoint
CREATE TYPE "public"."coupon_type" AS ENUM('fixed', 'percentage');--> statement-breakpoint
CREATE TABLE "cart_coupon" (
	"id" uuid PRIMARY KEY NOT NULL,
	"coupon" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_tag" (
	"id" uuid PRIMARY KEY NOT NULL,
	"value" "citext" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "item_script" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "item_script" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "cart_coupon" ADD CONSTRAINT "cart_coupon_id_cart_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."cart_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_coupon" ADD CONSTRAINT "cart_coupon_coupon_item_price_id_fk" FOREIGN KEY ("coupon") REFERENCES "public"."item_price"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_tag" ADD CONSTRAINT "item_tag_id_item_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "cart_coupon_id_idx" ON "cart_coupon" USING btree ("id");--> statement-breakpoint
CREATE INDEX "cart_coupon_item_price_idx" ON "cart_coupon" USING btree ("coupon");--> statement-breakpoint
CREATE UNIQUE INDEX "cart_coupon_id_item_price_idx" ON "cart_coupon" USING btree ("id","coupon");--> statement-breakpoint
CREATE INDEX "item_tag_id_idx" ON "item_tag" USING btree ("id");--> statement-breakpoint
CREATE INDEX "item_tag_value_idx" ON "item_tag" USING btree ("value");--> statement-breakpoint
CREATE UNIQUE INDEX "item_tag_value_unq" ON "item_tag" USING btree ("id","value");