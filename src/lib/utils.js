import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date) {
  const newDate = new Date(date);
  return newDate.toLocaleString();
}
