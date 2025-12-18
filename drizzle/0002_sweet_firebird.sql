ALTER TYPE "public"."pricing_model" RENAME TO "item_price_model";--> statement-breakpoint
DROP INDEX "item_info_slug_unq";--> statement-breakpoint
CREATE UNIQUE INDEX "item_info_slug_unq" ON "item" USING btree ("slug") WHERE status != 'deleted';