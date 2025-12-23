ALTER TABLE "user_sessions" RENAME TO "sessions";--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "user_sessions_uid_users_uid_fk";
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE cascade;