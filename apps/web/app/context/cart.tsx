import type { CartData, Item, ItemType } from "@bw/core"
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react"
import { useFetcher } from "react-router"

const CONTEXT = createContext<{
    items: Item[],
    empty: boolean,
    includes: (id: string) => boolean,
    push: (id: Item) => void,
    pop: (id: string) => void,
}>({} as any)

export const CartProvider = ({ children, cart }: PropsWithChildren<{ cart: CartData | undefined }>) => {
    const [inner, setInner] = useState<CartData>(cart ?? {
        id: '0000-0000-0000-0000',
        uid: null,
        items: []
    })

    const fetcher = useFetcher<CartData>()
    const current = fetcher.data ?? inner

    const includes = (id: string) => {
        return current.items.findIndex(x => x.id == id) >= 0
    }

    const push = async (item: Item) => {
        console.log('test')

        if (current.items.findIndex(x => x.id == item.id) == -1) {
            setInner(current => ({
                ...current,
                items: current.items.concat(item)
            }))
        }

        await fetcher.submit({ id: item.id }, {
            action: '/cart',
            method: 'put'
        })
    }

    const pop = async (id: string) => {
        if (current.items.findIndex(x => x.id == id) >= 0) {
            setInner(current => ({
                ...current,
                items: current.items.filter(x => x.id !== id)
            }))
        }

        await fetcher.submit({ id }, {
            action: '/cart',
            method: 'delete'
        })
    }

    useEffect(() => {
        if (fetcher.data && fetcher.state === 'idle') {
            setInner(fetcher.data)
        }
    }, [fetcher.data, fetcher.state])

    useEffect(() => {
        if (cart) {
            setInner(cart)
        }
    }, [cart])

    return (
        <CONTEXT.Provider value={{
            items: current.items,
            empty: current.items.length == 0,
            includes,
            push,
            pop,
        }}>
            {children}
        </CONTEXT.Provider>
    )
}

export const useCart = () => useContext(CONTEXT)