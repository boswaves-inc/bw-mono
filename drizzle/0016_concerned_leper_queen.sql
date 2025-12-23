CREATE TABLE "session_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"sid" uuid NOT NULL,
	"emitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session_events" ADD CONSTRAINT "session_events_sid_sessions_id_fk" FOREIGN KEY ("sid") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "session_events_sid_idx" ON "session_events" USING btree ("sid");--> statement-breakpoint
CREATE INDEX "session_events_emitted_at_idx" ON "session_events" USING btree ("emitted_at");