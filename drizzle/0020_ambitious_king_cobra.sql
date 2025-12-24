ALTER TABLE "email" RENAME TO "emails";--> statement-breakpoint
ALTER TABLE "email_queue" DROP CONSTRAINT "email_queue_ref_email_id_fk";
--> statement-breakpoint
ALTER TABLE "email_queue" ADD CONSTRAINT "email_queue_ref_emails_id_fk" FOREIGN KEY ("ref") REFERENCES "public"."emails"("id") ON DELETE cascade ON UPDATE cascade;