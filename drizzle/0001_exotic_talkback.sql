ALTER TABLE "item_info"
ALTER COLUMN "status"
SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "item_info"
ALTER COLUMN "status"
SET DEFAULT 'archived'::text;
--> statement-breakpoint
DROP TYPE "public"."status";
--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('archived', 'public');
--> statement-breakpoint
ALTER TABLE "item_info"
ALTER COLUMN "status"
SET DEFAULT 'archived'::"public"."status";
--> statement-breakpoint
ALTER TABLE "item_info"
ALTER COLUMN "status"
SET DATA TYPE "public"."status" USING "status"::"public"."status";
--> statement-breakpoint
ALTER TABLE "item_info"
ADD CONSTRAINT "item_info_title_unique" UNIQUE("title");