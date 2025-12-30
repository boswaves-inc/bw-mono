ALTER TABLE "email_queue" RENAME COLUMN "ref" TO "template";--> statement-breakpoint
ALTER TABLE "email_queue" DROP CONSTRAINT "email_queue_ref_emails_id_fk";
--> statement-breakpoint
ALTER TABLE "email_queue" ADD CONSTRAINT "email_queue_template_emails_id_fk" FOREIGN KEY ("template") REFERENCES "public"."emails"("id") ON DELETE set null ON UPDATE cascade;