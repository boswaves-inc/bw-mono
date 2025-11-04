ALTER TABLE "item_info" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "item_info" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;