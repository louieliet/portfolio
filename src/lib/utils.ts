import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Bare domain for a project link: "https://www.luma.app/x" -> "luma.app".
export const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, "")
