/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'cart_item'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "cart_item" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_id_item_pk" PRIMARY KEY("id","item");