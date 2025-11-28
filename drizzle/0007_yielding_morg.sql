ALTER TABLE "coupon_constraint" RENAME TO "coupon_item";--> statement-breakpoint
ALTER TABLE "coupon_item" DROP CONSTRAINT "coupon_constraint_id_coupon_info_id_fk";
--> statement-breakpoint
ALTER TABLE "coupon_item" ADD CONSTRAINT "coupon_item_id_coupon_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."coupon_info"("id") ON DELETE cascade ON UPDATE cascade;