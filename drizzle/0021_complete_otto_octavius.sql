CREATE TYPE "public"."email_status" AS ENUM('failed', 'pending', 'processed');--> statement-breakpoint
ALTER TYPE "public"."status" RENAME TO "item_status";--> statement-breakpoint
ALTER TABLE "email_queue" DROP CONSTRAINT "email_queue_ref_emails_id_fk";
--> statement-breakpoint
ALTER TABLE "email_queue" ALTER COLUMN "ref" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "slug" text GENERATED ALWAYS AS (lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "subject" text NOT NULL;--> statement-breakpoint
ALTER TABLE "email_queue" ADD CONSTRAINT "email_queue_ref_emails_id_fk" FOREIGN KEY ("ref") REFERENCES "public"."emails"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "email_events" DROP COLUMN "updated_at";