import { sql } from 'drizzle-orm';
import { Item, ItemScript, ScriptType, TvScript } from '@bw/core'
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import Chargebee, { Customer, type Item as CBItem } from 'chargebee'
import _ from 'lodash'
import { TradingView } from '@bw/core/tradingview';

const main = async () => {
    if (!process.env.CB_SITE) {
        throw new Error('CB_SITE variable not set')
    }

    if (!process.env.CB_FAMILY) {
        throw new Error('CB_FAMILY variable not set')
    }

    if (!process.env.CB_API_KEY) {
        throw new Error('CB_API_KEY variable not set')
    }

    if (!process.env.PG_DATABASE) {
        throw new Error("PG_DATABASE is not defined");
    }

    if (!process.env.PG_USERNAME) {
        throw new Error("PG_USERNAME is not defined");
    }

    if (!process.env.PG_PASSWORD) {
        throw new Error("PG_PASSWORD is not defined");
    }

    const tv_client = new TradingView();

    const cb_client = new Chargebee({
        site: process.env.CB_SITE,
        apiKey: process.env.CB_API_KEY
    })

    const pg_client = postgres({
        host: process.env.PG_HOST,
        port: process.env.PG_PORT ? Number(process.env.PG_PORT) : undefined,
        username: process.env.PG_USERNAME,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
        max: 1
    });

    const store = drizzle(pg_client);

    // console.log('⏳ Running migrations...');
    // await migrate(store, { migrationsFolder: 'drizzle' })

    let plans: (CBItem & { cf_tv_uuid?: string, cf_tv_type?: ScriptType })[] = [];
    let plan_offset = undefined;

    console.log('⏳ Fetching plans...');

    while (plans.length == 0 || plan_offset != undefined) {
        const { list, next_offset } = await cb_client.item.list({
            limit: 100,
            type: {
                is: 'plan'
            }
        })

        plans.push(...list.map(({ item }) => item))
        plan_offset = next_offset;

        // break out of the loop if there are no items
        if (list.length == 0) {
            break;
        }
    }

    console.log('⏳ Fetching scripts...');

    let scripts = await Promise.all(plans.map(({ id, cf_tv_uuid, cf_tv_type }) => new Promise<TvScript & { item_id: string, type: ScriptType } | undefined>(async (resolve, reject) => {
        // check if we have the cf_tv metadata set on charbebee
        if (cf_tv_uuid != undefined && cf_tv_type != undefined) {
            const response = await tv_client.script(cf_tv_uuid)

            // reject if we have an error response
            if ('detail' in response) {
                return reject(response)
            }

            // script found, include in repsponse
            return resolve({ ...response, item_id: id, type: cf_tv_type })
        }

        resolve(undefined)
    }))).then(x => x.filter(x => x != undefined));


    let customers: Customer[] = [];
    let customer_offset = undefined;

    console.log('⏳ Fetching customers...');

    while (customers.length == 0 || customer_offset != undefined) {
        const { list, next_offset } = await cb_client.customer.list({
            limit: 100,
        })

        customers.push(...list.map(({ customer }) => customer))
        customer_offset = next_offset;

        // break out of the loop if there are no customers
        if (list.length == 0) {
            break;
        }
    }

    console.log('✅ Finished collecting data, starting synchronization\n\n');

    await store.transaction(async tx => {
        console.log('⏳ Synchronizing plans...');

        if (plans.length > 0) {
            await tx.insert(Item).values(plans.map(({ id, external_name, name, type, status }) => ({
                id,
                type,
                status: status ?? 'archived',
                name: external_name ?? _.startCase(name),
            }))).onConflictDoNothing({ target: Item.id })
        }
        else {
            console.log('>> skipping, no items found');
        }

        console.log('⏳ Synchronizing plan scripts...');

        if (scripts.length > 0) {
            await tx.insert(ItemScript).values(scripts.map(({ uuid, item_id, type, description, image }) => ({
                uuid,
                type,
                description,
                id: item_id,
                image: image.big
            }))).onConflictDoNothing({ target: ItemScript.id })
        }
        else {
            console.log('>> skipping, no scripts found');
        }
    })

    console.log('✅ Done!');
    await pg_client.end();
}

main()
    .then()
    .catch(err => {
        console.error(err)

        throw new Error(err)
    })