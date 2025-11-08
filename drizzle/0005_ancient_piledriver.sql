CREATE TABLE "cart_info" (
	"id" uuid PRIMARY KEY NOT NULL,
	"uid" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_item" ("id" uuid PRIMARY KEY NOT NULL, "item" uuid);
--> statement-breakpoint
ALTER TABLE "cart_info"
ADD CONSTRAINT "cart_info_uid_user_info_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."user_info"("uid") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "cart_item"
ADD CONSTRAINT "cart_item_id_cart_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."cart_info"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "cart_item"
ADD CONSTRAINT "cart_item_item_item_info_id_fk" FOREIGN KEY ("item") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;