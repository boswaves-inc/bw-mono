CREATE TYPE "public"."status" AS ENUM('pending', 'published');
--> statement-breakpoint
CREATE TABLE "item_info" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"status" "status" DEFAULT 'pending' NOT NULL
);