DROP MATERIALIZED VIEW "public"."plan_data";
--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."plan_data" AS (
    select "item_info"."id",
        "item_info"."name",
        "item_info"."slug",
        "item_info"."status",
        json_build_object(
            'id',
            "item_script"."id",
            'uuid',
            "item_script"."uuid",
            'type',
            "item_script"."type",
            'image',
            "item_script"."image",
            'description',
            "item_script"."description"
        ) as "script",
        json_agg(
            json_build_object(
                'id',
                "item_price"."id",
                'uuid',
                "item_price"."uuid",
                'price',
                "item_price"."price",
                'period_unit',
                "item_price"."period_unit",
                'pricing_model',
                "item_price"."pricing_model",
                'currency_code',
                "item_price"."currency_code",
                'created_at',
                "item_price"."created_at",
                'updated_at',
                "item_price"."updated_at",
                'archived_at',
                "item_price"."archived_at"
            )
        ) as "prices",
        "item_info"."created_at",
        "item_info"."updated_at",
        "item_info"."archived_at"
    from "item_info"
        left join "item_script" on "item_script"."id" = "item_info"."id"
        left join "item_price" on "item_price"."id" = "item_info"."id"
    where "item_info"."type" = 'plan'
    group by "item_info"."id",
        "item_script"."id"
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS plan_data_id_idx ON plan_data(id);
--> statement-breakpoint
CREATE OR REPLACE FUNCTION refresh_plan_data() RETURNS TRIGGER AS $$ BEGIN REFRESH MATERIALIZED VIEW CONCURRENTLY plan_data;
RETURN NULL;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
DROP TRIGGER IF EXISTS refresh_plan_data_trggr ON item_info;
--> statement-breakpoint
DROP TRIGGER IF EXISTS refresh_plan_data_trggr ON item_price;
--> statement-breakpoint
DROP TRIGGER IF EXISTS refresh_plan_data_trggr ON item_script;
--> statement-breakpoint
CREATE TRIGGER refresh_plan_data_trggr
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON item_info FOR EACH STATEMENT EXECUTE FUNCTION refresh_plan_data();
--> statement-breakpoint
CREATE TRIGGER refresh_plan_data_trggr
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON item_price FOR EACH STATEMENT EXECUTE FUNCTION refresh_plan_data();
--> statement-breakpoint
CREATE TRIGGER refresh_plan_data_trggr
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON item_script FOR EACH STATEMENT EXECUTE FUNCTION refresh_plan_data();