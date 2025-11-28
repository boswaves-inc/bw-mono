ALTER TABLE "cart_info" RENAME TO "cart";--> statement-breakpoint
ALTER TABLE "item_info" RENAME TO "item";--> statement-breakpoint
ALTER TABLE "tag_info" RENAME TO "tag";--> statement-breakpoint
ALTER TABLE "user_info" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "item" DROP CONSTRAINT "item_info_slug_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_info_email_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_info_provider_id_unique";--> statement-breakpoint
ALTER TABLE "cart" DROP CONSTRAINT "cart_info_uid_user_info_uid_fk";
--> statement-breakpoint
ALTER TABLE "cart_coupon" DROP CONSTRAINT "cart_coupon_id_cart_info_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_id_cart_info_id_fk";
--> statement-breakpoint
ALTER TABLE "item_price" DROP CONSTRAINT "item_price_item_id_item_info_id_fk";
--> statement-breakpoint
ALTER TABLE "item_script" DROP CONSTRAINT "item_script_id_item_info_id_fk";
--> statement-breakpoint
ALTER TABLE "item_tag" DROP CONSTRAINT "item_tag_id_item_info_id_fk";
--> statement-breakpoint
ALTER TABLE "user_credentials" DROP CONSTRAINT "user_credentials_uid_user_info_uid_fk";
--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_uid_user_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."user"("uid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_coupon" ADD CONSTRAINT "cart_coupon_id_cart_id_fk" FOREIGN KEY ("id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_id_cart_id_fk" FOREIGN KEY ("id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_price" ADD CONSTRAINT "item_price_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_script" ADD CONSTRAINT "item_script_id_item_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_tag" ADD CONSTRAINT "item_tag_id_item_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_uid_user_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."user"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_provider_id_unique" UNIQUE("provider_id");