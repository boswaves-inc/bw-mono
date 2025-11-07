import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react"
import { useFetcher } from "react-router"
import type { Cart } from "~/types"

const CONTEXT = createContext<{
    coupons: string[],
    items: string[],
    empty: boolean,
    includes: (type: 'coupon' | 'item', id: string) => boolean,
    push: (type: 'coupon' | 'item', id: string) => void,
    pop: (type: 'coupon' | 'item', id: string) => void,
}>({} as any)

export const CartProvider = ({ children, cart }: PropsWithChildren<{ cart: Cart | undefined }>) => {
    const [inner, setInner] = useState<Cart>(cart ?? { items: [], coupons: [] })

    const fetcher = useFetcher<Cart>()
    const current = fetcher.data ?? inner

    const includes = (type: 'coupon' | 'item', id: string) => {
        if (type === 'coupon') {
            return current.coupons.includes(id)
        }
        return current.items.includes(id)
    }

    const push = async (type: 'coupon' | 'item', id: string) => {
        // Optimistic update
        if (type === 'coupon' && !current.coupons.includes(id)) {
            setInner(current => ({
                ...current,
                coupons: current.coupons.concat(id)
            }))
        }
        else if (type === 'item' && !current.items.includes(id)) {
            setInner(current => ({
                ...current,
                items: current.items.concat(id)
            }))
        }

        await fetcher.submit({ type, id }, {
            action: '/cart',
            method: 'put'
        })
    }

    const pop = async (type: 'coupon' | 'item', id: string) => {
        if (type === 'coupon' && current.coupons.includes(id)) {
            setInner(current => ({
                ...current,
                coupons: current.coupons.filter(x => x !== id)
            }))
        }
        else if (type === 'item' && current.items.includes(id)) {
            setInner(current => ({
                ...current,
                items: current.items.filter(x => x !== id)
            }))
        }

        await fetcher.submit({ type, id }, {
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
            coupons: current.coupons,
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