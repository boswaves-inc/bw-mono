DROP VIEW "public"."cart_data";--> statement-breakpoint
ALTER MATERIALIZED VIEW "public"."item_charge_data" RENAME TO "charge_data";--> statement-breakpoint
ALTER MATERIALIZED VIEW "public"."item_coupon_data" RENAME TO "coupon_data";--> statement-breakpoint
ALTER MATERIALIZED VIEW "public"."item_plan_data" RENAME TO "plan_data";--> statement-breakpoint
CREATE VIEW "public"."cart_data" AS (select "cart_info"."id", "cart_info"."uid", json_agg(json_build_object('id', "plan_data"."id", 'name', "plan_data"."name", 'type', "plan_data"."type", 'status', "plan_data"."status")) as "items" from "cart_info" left join "cart_item" on "cart_info"."id" = "cart_item"."id" inner join "plan_data" on "cart_item"."item" = "plan_data"."id" group by "cart_info"."id");