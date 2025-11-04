import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

if (!process.env.PG_DATABASE) {
    throw new Error("PG_DATABASE is not defined");
}

if (!process.env.PG_USERNAME) {
    throw new Error("PG_USERNAME is not defined");
}

if (!process.env.PG_PASSWORD) {
    throw new Error("PG_PASSWORD is not defined");
}

const main = async () => {
    const client = postgres({
        host: process.env.PG_HOST,
        port: process.env.PG_PORT ? Number(process.env.PG_PORT) : undefined,
        username: process.env.PG_USERNAME,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
        max: 1
    });

    const store = drizzle(client);

    console.log('⏳ Running migrations...');
    await migrate(store, { migrationsFolder: 'drizzle' })

    console.log('⏳ Setting up triggers...');
    store.transaction(async tx => {

        // Create unique index
        await tx.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS script_info_id_idx ON script_info(id)`)

        // Create trigger function
        await tx.execute(sql`
            CREATE OR REPLACE FUNCTION refresh_script_info()
            RETURNS TRIGGER AS $$
            BEGIN
                REFRESH MATERIALIZED VIEW CONCURRENTLY script_info;
                RETURN NULL;
            END;
            $$ LANGUAGE plpgsql
        `);

        // Triggers for item_info
        await tx.execute(sql`DROP TRIGGER IF EXISTS refresh_script_info_trggr ON item_info`);
        await tx.execute(sql`
            CREATE TRIGGER refresh_script_info_trggr
            AFTER INSERT OR UPDATE OR DELETE ON item_info
            FOR EACH STATEMENT
            EXECUTE FUNCTION refresh_script_info()
        `);

        // Triggers for item_script
        await tx.execute(sql`DROP TRIGGER IF EXISTS refresh_script_info_trggr ON item_script`);
        await tx.execute(sql`
            CREATE TRIGGER refresh_script_info_trggr
            AFTER INSERT OR UPDATE OR DELETE ON item_script
            FOR EACH STATEMENT
            EXECUTE FUNCTION refresh_script_info()
        `);

        // console.log('⏳ Setting up triggers...');
        // await setupScriptTriggers(db);
    })

    console.log('✅ Done!');
    await client.end();
}

main()
    .then()
    .catch(err => {
        console.error(err)

        throw new Error(err)
    })