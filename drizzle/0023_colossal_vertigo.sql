ALTER TABLE "item_tag" ADD COLUMN "item_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "item_tag" ADD COLUMN "status" "status" NOT NULL;--> statement-breakpoint
ALTER TABLE "item_tag" ADD CONSTRAINT "item_tag_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE cascade;