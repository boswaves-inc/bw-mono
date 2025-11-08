DROP MATERIALIZED VIEW "public"."cart_data";--> statement-breakpoint
ALTER TABLE "cart_item" RENAME COLUMN "id" TO "cart_id";--> statement-breakpoint
ALTER TABLE "cart_item" RENAME COLUMN "item" TO "item_id";--> statement-breakpoint
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_id_cart_info_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_item_item_info_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_id_item_pk";--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_item_id_pk" PRIMARY KEY("cart_id","item_id");--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_cart_info_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_item_id_item_info_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;