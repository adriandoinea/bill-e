import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sanitizeString = (id: string) => {
  const sanitized = id.replace(/\s+/g, "_").toLowerCase();

  return sanitized;
};
