import { useMobile } from "~/hooks/mobile"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";
import { useEffect, useState, type ComponentProps } from "react";

export const Panel = (props: ComponentProps<typeof Sheet>) => {
    const mobile = useMobile();
    const [open, setOpen] = useState(props.open ?? props.defaultOpen ?? false)

    const onOpenChange = (open: boolean) => {
        props.onOpenChange?.(open)
        setOpen(open)
    }

    useEffect(() => {
        if (props.open != undefined) {
            setOpen(props.open)
        }
    }, [props.open])

    return mobile ? <Drawer {...props} open={open} onOpenChange={setOpen} /> : <Sheet {...props} open={open} onOpenChange={onOpenChange} />
}

export const PanelTrigger = (props: ComponentProps<typeof SheetTrigger>) => {
    const mobile = useMobile();

    return mobile ? <DrawerTrigger {...props} /> : <SheetTrigger {...props} />
}

export const PanelContent = (props: ComponentProps<typeof SheetContent>) => {
    const mobile = useMobile();

    return mobile ? <DrawerContent {...props} /> : <SheetContent {...props} />
}

export const PanelHeader = (props: ComponentProps<typeof SheetHeader>) => {
    const mobile = useMobile();

    return mobile ? <DrawerHeader {...props} /> : <SheetHeader {...props} />
}

export const PanelFooter = (props: ComponentProps<typeof SheetFooter>) => {
    const mobile = useMobile();

    return mobile ? <DrawerFooter {...props} /> : <SheetFooter {...props} />
}

export const PanelTitle = (props: ComponentProps<typeof SheetTitle>) => {
    const mobile = useMobile();

    return mobile ? <DrawerTitle {...props} /> : <SheetTitle {...props} />
}

export const PanelDescription = (props: ComponentProps<typeof SheetDescription>) => {
    const mobile = useMobile();

    return mobile ? <DrawerDescription {...props} /> : <SheetDescription {...props} />
}

export const PanelClose = (props: ComponentProps<typeof SheetClose>) => {
    const mobile = useMobile();

    return mobile ? <DrawerClose {...props} /> : <SheetClose {...props} />
}