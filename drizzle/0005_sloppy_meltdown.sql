DROP INDEX "plan_price_item_idx";--> statement-breakpoint
DROP INDEX "plan_price_currency_idx";--> statement-breakpoint
DROP INDEX "plan_price_item_currency_idx";--> statement-breakpoint
CREATE INDEX "item_price_item_idx" ON "item_price" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "item_price_currency_idx" ON "item_price" USING btree ("currency_code");--> statement-breakpoint
CREATE INDEX "item_price_item_currency_idx" ON "item_price" USING btree ("item_id","currency_code","period","period_unit");