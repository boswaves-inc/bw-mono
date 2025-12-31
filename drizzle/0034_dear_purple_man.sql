ALTER TABLE "user_otps"
ALTER COLUMN "scope"
SET DATA TYPE text;
--> statement-breakpoint
DROP TYPE "public"."user_otp_scope";
--> statement-breakpoint
CREATE TYPE "public"."user_otp_scope" AS ENUM('verify_account', 'recover_account');
--> statement-breakpoint
ALTER TABLE "user_otps"
ALTER COLUMN "scope"
SET DATA TYPE "public"."user_otp_scope" USING "scope"::"public"."user_otp_scope";
--> statement-breakpoint
ALTER TABLE "emails"
ALTER COLUMN "processed_at" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "emails"
ALTER COLUMN "processed_at" DROP NOT NULL;