CREATE TYPE "public"."script_type" AS ENUM('library', 'indicator', 'screener', 'strategy');
--> statement-breakpoint
DROP MATERIALIZED VIEW "public"."script_info";
--> statement-breakpoint
ALTER TABLE "item_script"
ADD COLUMN "type" "script_type" NOT NULL;
--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."script_info" AS (
    select "item_info"."id",
        "item_script"."uuid",
        "item_script"."type",
        "item_info"."title",
        "item_info"."status",
        "item_script"."created_at",
        "item_script"."updated_at"
    from "item_script"
        inner join "item_info" on "item_script"."id" = "item_info"."id"
);