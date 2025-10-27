import { createContext, useContext, type PropsWithChildren } from "react"
import type { Theme } from "./types"

const context = createContext<Theme>('dark')

export const ThemeProvider = ({ children, theme }: PropsWithChildren<{ theme: Theme }>) => {
    return (
        <context.Provider value={theme}>
            {children}
        </context.Provider>
    )
}

export const useTheme = () => useContext(context)