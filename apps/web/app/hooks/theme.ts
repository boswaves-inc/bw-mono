import { useFetcher, useRouteLoaderData } from "react-router"

export type Theme = 'dark' | 'light'

export const useTheme = () => {
    const { theme } = useRouteLoaderData<{ theme: Theme }>('root')!
    const fetcher = useFetcher()

    const toggleTheme = async () => {
        await fetcher.submit({
            theme: theme == 'dark' ? 'light' : 'dark'
        }, {
            method: 'post',
            action: '/theme'
        })
    }

    return { theme, toggleTheme }
}