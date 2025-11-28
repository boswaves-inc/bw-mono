ALTER TABLE "item" RENAME TO "item_info";--> statement-breakpoint
ALTER TABLE "item_info" DROP CONSTRAINT "item_slug_unique";--> statement-breakpoint
ALTER TABLE "item_price" DROP CONSTRAINT "item_price_item_id_item_id_fk";
--> statement-breakpoint
ALTER TABLE "item_script" DROP CONSTRAINT "item_script_id_item_id_fk";
--> statement-breakpoint
ALTER TABLE "item_price" ADD CONSTRAINT "item_price_item_id_item_info_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_script" ADD CONSTRAINT "item_script_id_item_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "item_info" ADD CONSTRAINT "item_info_slug_unique" UNIQUE("slug");