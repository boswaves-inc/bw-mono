CREATE TABLE "coupon_constraint" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "coupon_constraint" ADD CONSTRAINT "coupon_constraint_id_coupon_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."coupon_info"("id") ON DELETE cascade ON UPDATE cascade;