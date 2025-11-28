CREATE TABLE "cart_coupon" (
	"id" uuid PRIMARY KEY NOT NULL,
	"item_price" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP VIEW "public"."cart_data";--> statement-breakpoint
ALTER TABLE "item_coupon" RENAME TO "coupon_info";--> statement-breakpoint
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_item_item_id_fk";
--> statement-breakpoint
ALTER TABLE "coupon_info" DROP CONSTRAINT "item_coupon_id_item_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_id_item_pk";--> statement-breakpoint
ALTER TABLE "cart_item" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "coupon_info" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "coupon_info" ADD COLUMN "slug" text GENERATED ALWAYS AS (lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "coupon_info" ADD COLUMN "status" "status" NOT NULL;--> statement-breakpoint
ALTER TABLE "coupon_info" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "coupon_info" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "cart_coupon" ADD CONSTRAINT "cart_coupon_id_cart_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."cart_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_coupon" ADD CONSTRAINT "cart_coupon_item_price_item_price_id_fk" FOREIGN KEY ("item_price") REFERENCES "public"."item_price"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "coupon_info_slug_unq" ON "coupon_info" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "coupon_info_idx_unq" ON "coupon_info" USING btree ("id") WHERE status != 'deleted';--> statement-breakpoint
CREATE UNIQUE INDEX "coupon_info_name_unq" ON "coupon_info" USING btree ("name") WHERE status != 'deleted';--> statement-breakpoint
ALTER TABLE "cart_item" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "cart_item" DROP COLUMN "item";--> statement-breakpoint
ALTER TABLE "coupon_info" ADD CONSTRAINT "coupon_info_slug_unique" UNIQUE("slug");