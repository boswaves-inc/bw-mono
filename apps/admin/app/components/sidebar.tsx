import {
    useLink,
    useMenu,
    useRefineOptions,
    type TreeMenuItem,
} from "@refinedev/core";
import { ChevronRight, ListIcon } from "lucide-react";
import React from "react";
import { SidebarContent as PrimitiveContent, SidebarRail as PrimitiveRail, Sidebar as Primitive, useSidebar as usePrimitive, SidebarHeader as PrimitiveHeader, SidebarTrigger as PrimitiveTrigger } from "./core/sidebar";
import { cn } from "~/utils";
import { Button } from "./core/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuPanel, DropdownMenuTrigger } from "./core/dropdown";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./core/collapsible";

export function Sidebar() {
    const { title } = useRefineOptions();
    const { open, mobile } = usePrimitive();
    const { menuItems, selectedKey } = useMenu();

    return (
        <Primitive collapsible="icon" className={cn("border-none")}>
            <PrimitiveRail />
            <PrimitiveHeader className={cn(
                "p-0",
                "h-16",
                "border-b",
                "border-border",
                "flex-row",
                "items-center",
                "justify-between",
                "overflow-hidden"
            )}>
                <div className={cn(
                    "whitespace-nowrap",
                    "flex",
                    "flex-row",
                    "h-full",
                    "items-center",
                    "justify-start",
                    "gap-2",
                    "transition-discrete",
                    "duration-200",
                    {
                        "pl-3": !open,
                        "pl-5": open,
                    }
                )}>
                    <div>{title.icon}</div>
                    <h2 className={cn(
                        "text-sm",
                        "font-bold",
                        "transition-opacity",
                        "duration-200",
                        {
                            "opacity-0": !open,
                            "opacity-100": open,
                        }
                    )}>
                        {title.text}
                    </h2>
                </div>

                <PrimitiveTrigger className={cn("text-muted-foreground", "mr-1.5", {
                    "opacity-0": !open,
                    "opacity-100": open || mobile,
                    "pointer-events-auto": open || mobile,
                    "pointer-events-none": !open && !mobile,
                })} />
            </PrimitiveHeader>
            <PrimitiveContent
                className={cn(
                    "transition-discrete",
                    "duration-200",
                    "flex",
                    "flex-col",
                    "gap-2",
                    "pt-2",
                    "pb-2",
                    "border-r",
                    "border-border",
                    {
                        "px-3": open,
                        "px-1": !open,
                    }
                )}
            >
                {menuItems.map((item: TreeMenuItem) => (
                    <Item
                        key={item.key || item.name}
                        item={item}
                        selectedKey={selectedKey}
                    />
                ))}
            </PrimitiveContent>
        </Primitive>
    );
}

type MenuItemProps = {
    item: TreeMenuItem;
    selectedKey?: string;
};

const Item = ({ item, selectedKey }: MenuItemProps) => {
    const { open } = usePrimitive();

    if (item.meta?.group) {
        return <ItemGroup item={item} selectedKey={selectedKey} />;
    }

    if (item.children && item.children.length > 0) {
        if (open) {
            return <ItemCollapsible item={item} selectedKey={selectedKey} />;
        }
        return <ItemDropdown item={item} selectedKey={selectedKey} />;
    }

    return <SidebarButton item={item} isSelected={item.key === selectedKey} asLink={true} />
}

function ItemGroup({ item, selectedKey }: MenuItemProps) {
    const { children } = item;
    const { open } = usePrimitive();

    return (
        <div className={cn("border-t", "border-sidebar-border", "pt-4")}>
            <span
                className={cn(
                    "ml-3",
                    "block",
                    "text-xs",
                    "font-semibold",
                    "uppercase",
                    "text-muted-foreground",
                    "transition-all",
                    "duration-200",
                    {
                        "h-8": open,
                        "h-0": !open,
                        "opacity-0": !open,
                        "opacity-100": open,
                        "pointer-events-none": !open,
                        "pointer-events-auto": open,
                    }
                )}
            >
                {getDisplayName(item)}
            </span>
            {children && children.length > 0 && (
                <div className={cn("flex", "flex-col")}>
                    {children.map((child: TreeMenuItem) => (
                        <Item
                            key={child.key || child.name}
                            item={child}
                            selectedKey={selectedKey}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ItemCollapsible({ item, selectedKey }: MenuItemProps) {
    const { name, children } = item;

    const chevronIcon = (
        <ChevronRight
            className={cn(
                "h-4",
                "w-4",
                "shrink-0",
                "text-muted-foreground",
                "transition-transform",
                "duration-200",
                "group-data-[state=open]:rotate-90"
            )}
        />
    );

    return (
        <Collapsible key={`collapsible-${name}`} className={cn("w-full", "group")}>
            <CollapsibleTrigger asChild>
                <SidebarButton item={item} rightIcon={chevronIcon} />
            </CollapsibleTrigger>
            <CollapsibleContent className={cn("ml-6", "flex", "flex-col", "gap-2")}>
                {children?.map((child: TreeMenuItem) => (
                    <Item
                        key={child.key || child.name}
                        item={child}
                        selectedKey={selectedKey}
                    />
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}

function ItemDropdown({ item, selectedKey }: MenuItemProps) {
    const { children } = item;
    const Link = useLink();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarButton item={item} />
            </DropdownMenuTrigger>
            <DropdownMenuPanel side="right" align="start">
                {children?.map((child: TreeMenuItem) => {
                    const { key: childKey } = child;
                    const isSelected = childKey === selectedKey;

                    return (
                        <DropdownMenuItem key={childKey || child.name} asChild>
                            <Link
                                to={child.route || ""}
                                className={cn("flex w-full items-center gap-2", {
                                    "bg-accent text-accent-foreground": isSelected,
                                })}
                            >
                                <div className={cn("w-4", {
                                    "text-muted-foreground": !isSelected,
                                    "text-sidebar-primary-foreground": isSelected,
                                })}>
                                    {child.meta?.icon ?? child.icon ?? <ListIcon />}
                                </div>
                                <span>{getDisplayName(child)}</span>
                            </Link>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuPanel>
        </DropdownMenu>
    );
}

function getDisplayName(item: TreeMenuItem) {
    return item.meta?.label ?? item.label ?? item.name;
}

type SidebarButtonProps = React.ComponentProps<typeof Button> & {
    item: TreeMenuItem;
    isSelected?: boolean;
    rightIcon?: React.ReactNode;
    asLink?: boolean;
    onClick?: () => void;
};

function SidebarButton({
    item,
    isSelected = false,
    rightIcon,
    asLink = false,
    className,
    onClick,
    ...props
}: SidebarButtonProps) {
    const Link = useLink();

    const buttonContent = (
        <>
            <div className={cn("w-4", {
                "text-muted-foreground": !isSelected,
                "text-sidebar-primary-foreground": isSelected,
            })}>
                {item.meta?.icon ?? item.icon ?? <ListIcon />}
            </div>
            <span
                className={cn("tracking-[-0.00875rem]", {
                    "flex-1": rightIcon,
                    "text-left": rightIcon,
                    "line-clamp-1": !rightIcon,
                    truncate: !rightIcon,
                    "font-normal": !isSelected,
                    "font-semibold": isSelected,
                    "text-sidebar-primary-foreground": isSelected,
                    "text-foreground": !isSelected,
                })}
            >
                {getDisplayName(item)}
            </span>
            {rightIcon}
        </>
    );

    return (
        <Button
            asChild={!!(asLink && item.route)}
            variant="ghost"
            size="lg"
            className={cn(
                "flex w-full items-center justify-start gap-2 py-2 px-3! text-sm",
                {
                    "bg-sidebar-primary": isSelected,
                    "hover:bg-sidebar-primary/90!": isSelected,
                    "text-sidebar-primary-foreground": isSelected,
                    "hover:text-sidebar-primary-foreground": isSelected,
                },
                className
            )}
            onClick={onClick}
            {...props}
        >
            {asLink && item.route ? (
                <Link to={item.route} className={cn("flex w-full items-center gap-2")}>
                    {buttonContent}
                </Link>
            ) : (
                buttonContent
            )}
        </Button>
    );
}
