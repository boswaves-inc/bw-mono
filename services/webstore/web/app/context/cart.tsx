import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react"
import { useFetcher, type AppLoadContext } from "react-router"

const CONTEXT = createContext<{
    items: { item_price: string, quantity: number }[],
    empty: boolean,
    includes: (id: string) => boolean,
    push: (id: string) => Promise<void>,
    pop: (id: string) => Promise<void>,
}>({} as any)

export const CartProvider = ({ children, cart }: PropsWithChildren<{ cart: AppLoadContext['cart'] }>) => {
    const [inner, setInner] = useState(cart)

    const fetcher = useFetcher<AppLoadContext['cart']>()

    const includes = (item_price: string) => {
        return inner.cart_item.findIndex(x => x.item_price == item_price) >= 0
    }

    const push = async (item_price: string, quantity: number = 1) => {
        if (!includes(item_price)) {
            setInner(current => ({
                ...current,
                items: current.cart_item.concat({
                    quantity,
                    item_price,
                })
            }))

            await fetcher.submit({ item_price }, {
                action: '/cart',
                method: 'put'
            })
        }
    }

    const pop = async (item_price: string) => {
        if (includes(item_price)) {
            setInner(current => ({
                ...current,
                items: current.cart_item.filter(x => x.item_price !== item_price)
            }))

            await fetcher.submit({ item_price }, {
                action: '/cart',
                method: 'delete'
            })
        }
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
            items: inner.cart_item,
            empty: inner.cart_item.length == 0,
            includes,
            push,
            pop,
        }}>
            {children}
        </CONTEXT.Provider>
    )
}

export const useCart = () => useContext(CONTEXT)