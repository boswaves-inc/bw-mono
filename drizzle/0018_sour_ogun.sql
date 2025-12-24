ALTER TYPE "public"."otp_type" RENAME TO "user_otp_scope";--> statement-breakpoint
CREATE TABLE "email" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_otps" RENAME COLUMN "type" TO "scope";--> statement-breakpoint
DROP INDEX "user_otps_uid_type_idx";--> statement-breakpoint
DROP INDEX "user_otps_active_unique_idx";--> statement-breakpoint
CREATE INDEX "user_otps_uid_type_idx" ON "user_otps" USING btree ("uid","scope");--> statement-breakpoint
CREATE UNIQUE INDEX "user_otps_active_unique_idx" ON "user_otps" USING btree ("uid","scope") WHERE "user_otps"."consumed_at" IS NULL;