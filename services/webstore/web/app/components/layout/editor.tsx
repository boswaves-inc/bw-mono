import { createContext, createElement, useContext, useEffect, useRef, type ComponentProps, type ComponentPropsWithoutRef, type PropsWithChildren } from "react";
import { apply as applyVisualEditing, setAttr } from '@directus/visual-editing';
import { useRevalidator } from "react-router";
import { Slot } from '@radix-ui/react-slot'
type EditorProps<G, H, F> = PropsWithChildren<{
    editMode: boolean
    state: {
        headerNavigation: H;
        footerNavigation: F;
        globals: G;
    }
}>

interface ApplyOptions {
    elements?: HTMLElement[] | HTMLElement;
    mode?: 'modal' | 'popover' | 'drawer';
    onSaved?: () => void;
}

const context = createContext({
    editMode: false
})

export const Editor = <G, H, F>({ editMode, children, state }: EditorProps<G, H, F>) => {
    useEffect(() => {

    })

    return (
        <context.Provider value={{ editMode }}>
            {children}
        </context.Provider>
    )
}

export function Editable<T extends keyof React.JSX.IntrinsicElements>({ type, children, ...props }: { type: T } & ComponentPropsWithoutRef<T>) {
    const ref = useRef<HTMLElement>(null)


    const { apply, editMode } = useEditor()
    const { revalidate } = useRevalidator()

    useEffect(() => {
        if (editMode && ref.current) {
            apply({
                elements: [ref.current],
                onSaved: () => revalidate()
            })
        }
    }, [editMode, apply, revalidate])

    return createElement(type, { ref, ...props }, children)
}

export const useEditor = () => {
    const { editMode } = useContext(context)

    const apply = ({ mode = 'modal', onSaved, elements }: Pick<ApplyOptions, 'elements' | 'onSaved' | 'mode'>) => {
        if (!editMode) {
            return
        }

        applyVisualEditing({
            onSaved,
            elements,
            directusUrl: ''
        })
    }

    return {
        editMode,
        apply,
        setAttribute: setAttr
    }
}