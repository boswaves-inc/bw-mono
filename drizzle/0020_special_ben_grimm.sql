CREATE TABLE "tag_info" (
	"id" uuid PRIMARY KEY NOT NULL,
	"value" "citext" NOT NULL,
	"status" "status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "tag_info_status_idx" ON "tag_info" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "tag_info_value_unq" ON "tag_info" USING btree ("value") WHERE status != 'deleted';