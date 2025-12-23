CREATE TYPE "public"."otp_type" AS ENUM('verify_account', 'reset_password');--> statement-breakpoint
CREATE TABLE "user_otps" (
	"id" uuid PRIMARY KEY NOT NULL,
	"uid" uuid NOT NULL,
	"type" "otp_type" NOT NULL,
	"hash" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"consumed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "user_credentials" DROP CONSTRAINT "user_credentials_uid_users_uid_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD COLUMN "revoked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user_otps" ADD CONSTRAINT "user_otps_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "user_otps_uid_type_idx" ON "user_otps" USING btree ("uid","type");--> statement-breakpoint
CREATE INDEX "user_otps_expires_at_idx" ON "user_otps" USING btree ("expires_at");--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE cascade;