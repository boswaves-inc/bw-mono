import { createContext, createRef, useContext, useEffect, useRef, useState, type PropsWithChildren, type RefObject } from "react";
import type { Component, } from "../types";
import type { CardApi } from "./types";
import { useChargebee } from "./provider";

const CONTEXT = createContext<{ component: Component | null }>(null as any)

export const useCard = () => {
    const ref = createRef<CardApi>()

    return {
        ref,
        component: () => ref.current?.component()
    }
}

export const Card = ({ ref, children }: PropsWithChildren<{ ref?: RefObject<CardApi | null> }>) => {
    const chargebee = useChargebee();
    const [component, setComponent] = useState<Component | null>(null)

    useEffect(() => {
        if (chargebee.instance) {
            const component = chargebee.instance.createComponent('card', {
                placeholder: {
                    number: "Number",
                    expiry: "Expiry",
                    cvv: "CVV",
                },
                // // Add these options to help with validation
                // classes: {
                //     focus: 'focus',
                //     complete: 'complete',
                //     invalid: 'invalid',
                //     empty: 'empty'
                // }
            })

            setComponent(component)
        }
    }, [chargebee.instance])

    useEffect(() => {
        if (ref && component) {
            ref.current = {
                component: () => component
                // tokenize: () => {
                //     return component.tokenize()
                // }
            }
        }
    }, [component])

    return (
        <CONTEXT.Provider value={{ component }}>
            {children}
        </CONTEXT.Provider>
    )
}

export const CardNumber = () => {
    const { component } = useContext(CONTEXT)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (component && ref.current) {
            const field = component.createField('number')

            field.mount(ref.current)

            return () => {
                field.destroy()
            }
        }
    }, [component, ref.current])

    return (
        <div ref={ref} />
    )
}

export const CardExpiry = () => {
    const { component } = useContext(CONTEXT)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (component && ref.current) {
            const field = component.createField('expiry')

            field.mount(ref.current)

            return () => {
                field.destroy()
            }
        }
    }, [component, ref.current])

    return (
        <div ref={ref} />
    )
}

export const CardCvv = () => {
    const { component } = useContext(CONTEXT)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (component && ref.current) {
            const field = component.createField('cvv')

            field.mount(ref.current)

            return () => {
                field.destroy()
            }
        }
    }, [component, ref.current])

    return (
        <div ref={ref} />
    )
}