CREATE TABLE "user_sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"uid" uuid NOT NULL,
	"nonce" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"consumed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "user_sessions_uid_idx" ON "user_sessions" USING btree ("uid");