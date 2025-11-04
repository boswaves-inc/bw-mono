DROP MATERIALIZED VIEW "public"."script_info";--> statement-breakpoint
ALTER TABLE "item_script" DROP CONSTRAINT "item_script_id_item_info_id_fk";
--> statement-breakpoint
ALTER TABLE "item_script" ADD CONSTRAINT "item_script_id_item_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item_info"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."script_info" AS (select "item_info"."id", "item_info"."title", "item_info"."status", "item_script"."script", "item_info"."created_at", "item_info"."updated_at" > "item_script"."updated_at" as "updated_at" from "item_script" inner join "item_info" on "item_script"."id" = "item_info"."id");