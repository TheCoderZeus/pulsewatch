import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMs(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) return "--";
  return `${ms}ms`;
}

export function formatPercent(percent: number | null | undefined): string {
  if (percent === null || percent === undefined) return "--%";
  return `${percent.toFixed(2)}%`;
}
