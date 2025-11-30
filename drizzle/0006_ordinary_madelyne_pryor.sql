DROP INDEX "item_tag_item_id_unq";--> statement-breakpoint
CREATE UNIQUE INDEX "item_tag_item_id_unq" ON "item_tag" USING btree ("item_id") WHERE status != 'deleted';