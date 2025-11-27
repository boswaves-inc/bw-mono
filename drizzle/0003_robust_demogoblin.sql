ALTER TABLE "item_charge" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "item_charge" CASCADE;--> statement-breakpoint
ALTER TABLE "item_price" ALTER COLUMN "period" DROP DEFAULT;