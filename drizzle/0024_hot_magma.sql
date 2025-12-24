ALTER TABLE "email_queue" RENAME COLUMN "to" TO "sender";--> statement-breakpoint
ALTER TABLE "email_queue" RENAME COLUMN "from" TO "recipient";