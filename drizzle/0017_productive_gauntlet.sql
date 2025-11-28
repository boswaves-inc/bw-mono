DROP VIEW "public"."cart_data";--> statement-breakpoint
CREATE INDEX "cart_uid_idx" ON "cart_info" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "cart_item_id_idx" ON "cart_item" USING btree ("id");--> statement-breakpoint
CREATE INDEX "cart_item_item_price_idx" ON "cart_item" USING btree ("item_price");--> statement-breakpoint
CREATE UNIQUE INDEX "cart_item_id_item_price_idx" ON "cart_item" USING btree ("id","item_price");--> statement-breakpoint
CREATE VIEW "public"."cart_data" AS (select "cart_info"."id", "cart_info"."uid", json_agg(json_build_object('id', "cart_item"."id", 'quantity', "cart_item"."quantity", 'item_price', "cart_item"."item_price")) FILTER (WHERE "cart_item"."id" is not null) as "items" from "cart_info" inner join "cart_item" on "cart_info"."id" = "cart_item"."id" group by "cart_info"."id");