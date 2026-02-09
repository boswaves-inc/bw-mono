CREATE TYPE "public"."user_otp_scope" AS ENUM('verify_account', 'recover_account');--> statement-breakpoint
CREATE TYPE "public"."user_provider" AS ENUM('internal', 'google');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('deleted', 'pending', 'active');--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"uid" uuid NOT NULL,
	"nonce" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expired_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
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
CREATE TABLE "users" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"status" "user_status" DEFAULT 'pending' NOT NULL,
	"email" "citext" NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"provider" "user_provider" DEFAULT 'internal' NOT NULL,
	"provider_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_provider_id_unique" UNIQUE("provider_id"),
	CONSTRAINT "users_provider_id_check" CHECK (("users"."provider" = 'internal' AND "users"."provider_id" IS NULL) OR ("users"."provider" != 'internal' AND "users"."provider_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "user_credentials" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_otps" (
	"id" uuid PRIMARY KEY NOT NULL,
	"uid" uuid NOT NULL,
	"scope" "user_otp_scope" NOT NULL,
	"hash" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"consumed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "session_oauth" ADD CONSTRAINT "session_oauth_id_sessions_id_fk" FOREIGN KEY ("id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_otps" ADD CONSTRAINT "user_otps_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."users"("uid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "sessions_uid_idx" ON "sessions" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "sessions_expired_at_idx" ON "sessions" USING btree ("expired_at");--> statement-breakpoint
CREATE INDEX "session_oauth_uid_idx" ON "session_oauth" USING btree ("id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");--> statement-breakpoint
CREATE INDEX "users_provider_id_idx" ON "users" USING btree ("provider","provider_id");--> statement-breakpoint
CREATE INDEX "user_credentials_uid_idx" ON "user_credentials" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "user_otps_uid_type_idx" ON "user_otps" USING btree ("uid","scope");--> statement-breakpoint
CREATE INDEX "user_otps_expires_at_idx" ON "user_otps" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "user_otps_active_unique_idx" ON "user_otps" USING btree ("uid","scope") WHERE "user_otps"."consumed_at" IS NULL AND "user_otps"."revoked_at" IS NULL;