import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const BACKEND_URL = "/api/backend";
// console.log("Backend URL", BACKEND_URL);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
