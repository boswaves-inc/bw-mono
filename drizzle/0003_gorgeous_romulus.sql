DROP INDEX "item_price_item_currency_unq";--> statement-breakpoint
DROP INDEX "item_price_item_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "item_price_item_currency_idx" ON "item_price" USING btree ("item_id","currency_code","period","period_unit") WHERE status != 'deleted';--> statement-breakpoint
CREATE INDEX "item_price_item_idx" ON "item_price" USING btree ("item_id");