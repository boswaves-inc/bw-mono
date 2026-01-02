import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import type { Theme } from "~/types";

const CONTEXT = createContext<{
    theme: Theme;
    setTheme: (theme: Theme) => void;
}>({} as any);

export function ThemeProvider({ children, theme }: PropsWithChildren<{ theme: Theme }>) {
    const [inner, setInner] = useState<Theme>(theme);

    const setTheme = async (theme: Theme) => {
        localStorage.setItem("refine-ui-theme", theme);

        setInner(theme);

        fetch('/theme', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ theme })
        })
    }

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const current = inner === 'system' ? system : inner

        root.classList.add(current);
    }, [inner]);

    return (
        <CONTEXT.Provider value={{ theme: inner, setTheme }}>
            {children}
        </CONTEXT.Provider>
    );
}

export function useTheme() {
    const context = useContext(CONTEXT);

    if (context === undefined) {
        console.error("useTheme must be used within a ThemeProvider");
    }

    return context;
}