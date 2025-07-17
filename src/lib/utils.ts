import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nasnavApi = 'https://api.dev.meetusvr.com/';
export const yeshteryApi = 'https://api-yeshtery.dev.meetusvr.com/v1/';
export const localApi = 'http://localhost:8060/v1/';