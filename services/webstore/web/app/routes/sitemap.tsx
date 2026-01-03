import { data } from "react-router";
import type { Route } from "./+types/sitemap";

export async function loader({ context: { cdn } }: Route.LoaderArgs) {
    try {
        const pages = await cdn.read_items('pages', {
            filter: {
                status: { _eq: 'published' },
            },
            fields: [
                'permalink',
                'published_at'
            ], limit: -1
        })

        const urls = pages.filter(({ published_at }) => published_at).map(({ permalink, published_at }) => ({
            url: `${permalink}`,
            last_modified: published_at || new Date().toISOString()
        }))

        return data(urls)
    } catch (error) {
        console.error('Error generating sitemap:', error);
        throw new Error('Failed to generate sitemap');
    }
}
