CREATE TABLE "email_queue" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "email_queue" ADD CONSTRAINT "email_queue_ref_email_id_fk" FOREIGN KEY ("ref") REFERENCES "public"."email"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "email_events" ADD CONSTRAINT "email_events_id_email_queue_id_fk" FOREIGN KEY ("id") REFERENCES "public"."email_queue"("id") ON DELETE cascade ON UPDATE cascade;