ALTER TABLE "emails" RENAME COLUMN "idempotency_key" TO "fingerprint";--> statement-breakpoint
ALTER TABLE "emails" DROP CONSTRAINT "emails_idempotency_key_unique";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN "template";--> statement-breakpoint
ALTER TABLE "emails" ADD CONSTRAINT "emails_fingerprint_unique" UNIQUE("fingerprint");