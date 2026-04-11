import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSEOProgress(checklist: Record<string, boolean>): number {
  const total = Object.keys(checklist).length;
  const completed = Object.values(checklist).filter(Boolean).length;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}
