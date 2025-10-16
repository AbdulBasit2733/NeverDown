import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BACKEND_URL = "http://localhost:3005"

export const getToken = () => {
  const token = localStorage.getItem("token") ?? ""
  return token;
}
