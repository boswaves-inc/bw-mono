// import { readItems, withToken } from '@directus/sdk';
// import { Client } from '../client';
// import fields from './fields.json'
// import type { Page } from '../types';

// export class Directus$Page extends Client {
//     public async list(permalink: string) {
//         try {
//             const data = await this._client.request<Page[]>(withToken('', readItems('pages', {
//                 fields: fields as any,
//                 limit: 1,
//                 filter: {
//                     permalink: { _eq: permalink },
//                     status: { _eq: 'published' },
//                 },
//                 deep: {
//                     blocks: {
//                         _sort: ['sort'],
//                         _filter: {
//                             hide_block: { _neq: true }
//                         }
//                     }
//                 }
//             }))).then(x => x.at(0))

//             if (data == undefined) {
//                 throw new Error('Page not found')
//             }

//             return data
//         } catch (error) {
//             console.error('Error fetching page data:', error);

//             throw new Error('Failed to fetch page data');
//         }
//     }

//     public async data_by_id(id: string) {

//     }

//     public async id(permalink: string) {

//     }
// }