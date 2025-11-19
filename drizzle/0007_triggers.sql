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