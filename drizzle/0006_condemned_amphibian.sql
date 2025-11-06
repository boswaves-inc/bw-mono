DROP MATERIALIZED VIEW "public"."script_info";--> statement-breakpoint
ALTER TABLE "item_info" RENAME COLUMN "title" TO "name";--> statement-breakpoint
ALTER TABLE "item_info" DROP CONSTRAINT "item_info_title_unique";--> statement-breakpoint
ALTER TABLE "item_info" ADD CONSTRAINT "item_info_name_unique" UNIQUE("name");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."script_info" AS (select "item_info"."id", "item_script"."uuid", "item_script"."type", "item_info"."name", "item_info"."status", "item_script"."created_at", "item_script"."updated_at" from "item_script" inner join "item_info" on "item_script"."id" = "item_info"."id");