CREATE TABLE "session_oauth" (
	"id" uuid PRIMARY KEY NOT NULL,
	"scope" text,
	"provider" "user_provider" NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expired_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DROP TABLE "session_events" CASCADE;--> statement-breakpoint
ALTER TABLE "session_oauth" ADD CONSTRAINT "session_oauth_id_sessions_id_fk" FOREIGN KEY ("id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "session_oauth_uid_idx" ON "session_oauth" USING btree ("id");