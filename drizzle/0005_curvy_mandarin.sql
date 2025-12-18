CREATE TABLE "coupon_codes" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupon_sets" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "coupons" DROP CONSTRAINT "coupon_info_discount_check";--> statement-breakpoint
ALTER TABLE "coupons" DROP CONSTRAINT "coupon_info_valid_check";--> statement-breakpoint
DROP INDEX "coupon_info_idx_unq";--> statement-breakpoint
DROP INDEX "coupon_info_name_unq";--> statement-breakpoint
DROP INDEX "coupon_info_slug_unq";--> statement-breakpoint
CREATE UNIQUE INDEX "coupons_name_unq" ON "coupons" USING btree ("name") WHERE status != 'deleted';--> statement-breakpoint
ALTER TABLE "coupons" DROP COLUMN "slug";--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_discount_check" CHECK ((discount_type = 'percentage' AND discount_percentage IS NOT NULL) OR (discount_type = 'fixed_amount' AND discount_currency IS NOT NULL AND discount_amount IS NOT NULL));--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_valid_check" CHECK ((valid_from IS NULL AND valid_till IS NULL) OR (valid_from IS NOT NULL AND valid_till IS NOT NULL and valid_till > valid_from));