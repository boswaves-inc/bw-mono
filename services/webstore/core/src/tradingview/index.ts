import type { TvError, TvScript } from "./types"
export type { TvError, TvScript }

export class TradingView {
    constructor() {

    }

    public script(id: string) {
        return this.fetch<TvScript>(`/api/v1/ideas/${id}`, { method: 'GET' })
    }

    private async fetch<T>(endpoint: string, init?: RequestInit | undefined) {
        const response = await fetch(`https://www.tradingview.com${endpoint}`, init)

        if (response.status >= 400) {
            return await response.json() as TvError
        }

        return await response.json() as T
    }
}