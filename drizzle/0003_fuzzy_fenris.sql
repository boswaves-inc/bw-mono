DROP MATERIALIZED VIEW "public"."script_info";--> statement-breakpoint
ALTER TABLE "item_script" RENAME COLUMN "script" TO "uuid";--> statement-breakpoint
ALTER TABLE "item_script" DROP CONSTRAINT "item_script_script_unique";--> statement-breakpoint
ALTER TABLE "item_script" ADD CONSTRAINT "item_script_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."script_info" AS (select "item_info"."id", "item_info"."title", "item_info"."status", "item_script"."uuid", "item_script"."created_at", "item_script"."updated_at" from "item_script" inner join "item_info" on "item_script"."id" = "item_info"."id");