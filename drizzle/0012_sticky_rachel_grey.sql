CREATE TYPE "public"."user_status" AS ENUM('deleted', 'pending', 'active');--> statement-breakpoint
CREATE TABLE "user_oauth" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"scope" text,
	"provider" "user_provider" NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expired_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_credentials" RENAME COLUMN "revoked_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "user_sessions" RENAME COLUMN "consumed_at" TO "revoked_at";--> statement-breakpoint
DROP INDEX "user_sessions_uid_idx";--> statement-breakpoint
ALTER TABLE "user_otps" ALTER COLUMN "expires_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_sessions" ALTER COLUMN "expired_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "user_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_oauth" ADD CONSTRAINT "user_oauth_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "user_oauth_uid_idx" ON "user_oauth" USING btree ("uid");--> statement-breakpoint
CREATE UNIQUE INDEX "user_oauth_uid_provider_idx" ON "user_oauth" USING btree ("uid","provider");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");--> statement-breakpoint
CREATE INDEX "users_provider_id_idx" ON "users" USING btree ("provider","provider_id");--> statement-breakpoint
CREATE INDEX "user_credentials_uid_idx" ON "user_credentials" USING btree ("uid");--> statement-breakpoint
CREATE UNIQUE INDEX "user_otps_active_unique_idx" ON "user_otps" USING btree ("uid","type") WHERE "user_otps"."consumed_at" IS NULL;--> statement-breakpoint
CREATE INDEX "sessions_uid_idx" ON "user_sessions" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "sessions_expired_at_idx" ON "user_sessions" USING btree ("expired_at");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "verified_at";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_provider_id_check" CHECK (("users"."provider" = 'internal' AND "users"."provider_id" IS NULL) OR ("users"."provider" != 'internal' AND "users"."provider_id" IS NOT NULL));