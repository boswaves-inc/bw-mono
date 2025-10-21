import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react"
import type { Client } from "../types"

const context = createContext<{
    instance: Client | null
}>(null as any)

export const useChargebee = () => useContext(context)

export default ({ children, site, pubKey }: PropsWithChildren<{ site: string, pubKey: string }>) => {
    const [instance, setInstance] = useState<Client | null>(null)

    useEffect(() => {
        if (window.Chargebee) {
            const instance = window.Chargebee.init({
                site,
                publishableKey: pubKey,
                enableTestCards: true
            })

            instance.load('components').then(() => {
                setInstance(instance)
            })
        }
    }, [site, pubKey])

    return (
        <context.Provider value={{ instance }}>
            {children}
        </context.Provider>
    )
}