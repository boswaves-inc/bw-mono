import { type ClassValue, clsx } from "clsx";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import z, { ZodType } from "zod/v4";
import { render as renderTemplate, toPlainText } from '@react-email/components';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
