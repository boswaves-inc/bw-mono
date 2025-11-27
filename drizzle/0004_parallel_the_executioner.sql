DROP INDEX "plan_price_item_currency_idx";--> statement-breakpoint
CREATE INDEX "plan_price_item_currency_idx" ON "item_price" USING btree ("item_id","currency_code","period","period_unit");