"use client";

import { Check, ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import React, { useMemo } from "react";
import { useTheme } from "./provider";
import { DropdownMenu, DropdownMenuPanel, DropdownMenuItem, DropdownMenuTrigger } from "../core/dropdown";
import { Button } from "../core/button";
import { cn } from "~/utils";

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  icon: React.ReactNode;
};

const options: ThemeOption[] = [
  {
    value: "light",
    label: "Light",
    icon: <Sun className="h-4 w-4" />,
  },
  {
    value: "dark",
    label: "Dark",
    icon: <Moon className="h-4 w-4" />,
  },
  {
    value: "system",
    label: "System",
    icon: <Monitor className="h-4 w-4" />,
  },
];

export function ThemeSelect() {
  const { theme, setTheme } = useTheme();
  const currentTheme = options.find((option) => option.value === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className={cn(
            "w-full",
            "justify-between",
            "px-3",
            "text-left",
            "text-sm",
            "font-normal",
            "text-foreground",
            "hover:bg-accent",
            "hover:text-accent-foreground",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-ring"
          )}
        >
          <div className="flex items-center gap-2">
            {currentTheme?.icon}
            <span>{currentTheme?.label}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPanel align="end" className="min-w-40 space-y-1">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            aria-selected={theme === option.value}
            onClick={() => setTheme(option.value)}
            className={cn("flex items-center gap-2 cursor-pointer relative pr-8 aria-selected:bg-accent aria-selected:text-accent-foreground")}
          >
            {option.icon}
            <span>{option.label}</span>
            {theme === option.value && (<Check className="h-4 w-4 absolute right-2 text-primary" />)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuPanel>
    </DropdownMenu>
  );
}

ThemeSelect.displayName = "ThemeSelect";
