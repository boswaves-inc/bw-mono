ALTER TABLE "email_queue" RENAME COLUMN "updated_at" TO "processed_at";--> statement-breakpoint
ALTER TABLE "email_queue" ADD COLUMN "to" text NOT NULL;--> statement-breakpoint
ALTER TABLE "email_queue" ADD COLUMN "from" text NOT NULL;--> statement-breakpoint
ALTER TABLE "email_queue" ADD COLUMN "subject" text NOT NULL;--> statement-breakpoint
ALTER TABLE "email_queue" ADD COLUMN "status" "email_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
CREATE INDEX "emails_slug_idx" ON "emails" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "email_queue_status_idx" ON "email_queue" USING btree ("status");--> statement-breakpoint
CREATE INDEX "email_queue_created_at_idx" ON "email_queue" USING btree ("created_at");