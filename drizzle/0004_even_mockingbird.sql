ALTER TABLE "cart" RENAME TO "carts";--> statement-breakpoint
ALTER TABLE "cart_coupon" RENAME TO "cart_coupons";--> statement-breakpoint
ALTER TABLE "cart_item" RENAME TO "cart_items";--> statement-breakpoint
ALTER TABLE "coupon" RENAME TO "coupons";--> statement-breakpoint
ALTER TABLE "item" RENAME TO "items";--> statement-breakpoint
ALTER TABLE "item_price" RENAME TO "item_prices";--> statement-breakpoint
ALTER TABLE "item_script" RENAME TO "item_scripts";--> statement-breakpoint
ALTER TABLE "item_tag" RENAME TO "item_tags";--> statement-breakpoint
ALTER TABLE "script" RENAME TO "scripts";--> statement-breakpoint
ALTER TABLE "tag" RENAME TO "tags";--> statement-breakpoint
ALTER TABLE "user" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_provider_id_unique";--> statement-breakpoint
ALTER TABLE "carts" DROP CONSTRAINT "cart_uid_user_uid_fk";
--> statement-breakpoint
ALTER TABLE "cart_coupons" DROP CONSTRAINT "cart_coupon_id_cart_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_coupons" DROP CONSTRAINT "cart_coupon_coupon_item_price_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_item_id_cart_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_item_item_price_item_price_id_fk";
--> statement-breakpoint
ALTER TABLE "item_prices" DROP CONSTRAINT "item_price_item_id_item_id_fk";
--> statement-breakpoint
ALTER TABLE "item_scripts" DROP CONSTRAINT "item_script_id_script_id_fk";
--> statement-breakpoint
ALTER TABLE "item_scripts" DROP CONSTRAINT "item_script_item_id_item_id_fk";
--> statement-breakpoint
ALTER TABLE "item_tags" DROP CONSTRAINT "item_tag_id_tag_id_fk";
--> statement-breakpoint
ALTER TABLE "item_tags" DROP CONSTRAINT "item_tag_item_id_item_id_fk";
--> statement-breakpoint
ALTER TABLE "user_credentials" DROP CONSTRAINT "user_credentials_uid_user_uid_fk";
--> statement-breakpoint
ALTER TABLE "item_scripts" DROP CONSTRAINT "item_script_item_id_id_pk";--> statement-breakpoint
ALTER TABLE "item_scripts" ADD CONSTRAINT "item_scripts_item_id_id_pk" PRIMARY KEY("item_id","id");--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_coupons" ADD CONSTRAINT "cart_coupons_id_carts_id_fk" FOREIGN KEY ("id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_coupons" ADD CONSTRAINT "cart_coupons_coupon_item_prices_id_fk" FOREIGN KEY ("coupon") REFERENCES "public"."item_prices"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_id_carts_id_fk" FOREIGN KEY ("id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_item_price_item_prices_id_fk" FOREIGN KEY ("item_price") REFERENCES "public"."item_prices"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_prices" ADD CONSTRAINT "item_prices_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_scripts" ADD CONSTRAINT "item_scripts_id_scripts_id_fk" FOREIGN KEY ("id") REFERENCES "public"."scripts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_scripts" ADD CONSTRAINT "item_scripts_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_tags" ADD CONSTRAINT "item_tags_id_tags_id_fk" FOREIGN KEY ("id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_tags" ADD CONSTRAINT "item_tags_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_provider_id_unique" UNIQUE("provider_id");