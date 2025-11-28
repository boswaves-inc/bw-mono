ALTER TABLE "tag" RENAME COLUMN "value" TO "name";--> statement-breakpoint
DROP INDEX "tag_info_value_unq";--> statement-breakpoint
ALTER TABLE "tag" ADD COLUMN "slug" text GENERATED ALWAYS AS (lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))) STORED NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "tag_info_slug_unq" ON "tag" USING btree ("slug") WHERE status != 'deleted';--> statement-breakpoint
ALTER TABLE "tag" ADD CONSTRAINT "tag_slug_unique" UNIQUE("slug");