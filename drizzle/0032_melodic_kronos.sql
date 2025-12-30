CREATE TABLE "emails" (
	"id" uuid PRIMARY KEY NOT NULL,
	"sender" text NOT NULL,
	"subject" text NOT NULL,
	"recipient" text NOT NULL,
	"template" uuid,
	"status" "email_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_templates" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text GENERATED ALWAYS AS (lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))) STORED NOT NULL,
	"subject" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "emails" ADD CONSTRAINT "emails_template_email_templates_id_fk" FOREIGN KEY ("template") REFERENCES "public"."email_templates"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "email_queue_status_idx" ON "emails" USING btree ("status");--> statement-breakpoint
CREATE INDEX "email_queue_created_at_idx" ON "emails" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "emails_slug_idx" ON "email_templates" USING btree ("slug");