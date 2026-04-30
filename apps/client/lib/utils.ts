import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// console.log("Backend URL", BACKEND_URL);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
