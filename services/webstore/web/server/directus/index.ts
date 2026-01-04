import {
    createDirectus,
    readItems,
    readItem,
    readSingleton,
    rest,
    readUser,
    createItem,
    uploadFiles,
    withToken,
    type ClientOptions,
    type DirectusClient,
    type RestClient,
    type RestCommand,
    type RegularCollections,
    type Query,
    type CollectionType,
    type QueryItem,
    readFile,
    type DirectusFile,
    type ReadFileOutput,
} from '@directus/sdk';
import type { Schema } from './schema';
import Queue from 'p-queue';

interface DirectusOptions {
    url: string,
    token: string
}

export class Directus {
    protected _client: DirectusClient<Schema> & RestClient<Schema>;
    protected _queue: Queue;
    protected _token: string;

    public constructor({ url, token }: DirectusOptions) {
        this._token = token

        this._queue = new Queue({
            interval: 500,
            intervalCap: 10,
            carryoverIntervalCount: true
        })

        this._client = createDirectus<Schema>(url, {
            globals: {
                fetch: (...args) => this._queue.add(() => this._fetch(0, ...args))
            }
        }).with(rest())
    }

    private async _sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }


    private async _fetch(count: number, ...args: Parameters<typeof fetch>): Promise<Response> {
        const response = await fetch(...args);

        if (count > 2 || response.status !== 429) {
            return response;
        }

        console.warn(`[429] Too Many Requests (Attempt ${count + 1})`);

        await this._sleep(500);
        return this._fetch(count + 1, ...args);
    }

    private async _request<Output>(options: RestCommand<Output, Schema>): Promise<Output> {
        return this._client.request(withToken(this._token, options))
    }

    public async read_items<Collection extends RegularCollections<Schema>, const TQuery extends Query<Schema, CollectionType<Schema, Collection>>>(collection: Collection, query?: TQuery) {
        return this._request(readItems<Schema, Collection, TQuery>(collection, query))
    }

    public async read_file<Schema, const TQuery extends Query<Schema, DirectusFile<Schema>>>(key: DirectusFile<Schema>["id"], query?: TQuery) {
        return await this._request<ReadFileOutput<Schema, TQuery>>(readFile<Schema, TQuery>(key, query))
    }

    public async read_item<Collection extends RegularCollections<Schema>, const TQuery extends QueryItem<Schema, CollectionType<Schema, Collection>>>(collection: Collection, key: string | number, query?: TQuery) {
        return this._request(readItem<Schema, Collection, TQuery>(collection, key, query))
    }
}



