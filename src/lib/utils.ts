import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscountedPrice(
  price: number,
  discount: number
): number {
  return Math.round(price * (1 - discount / 100));
}

export function calculateSavings(price: number, discount: number): number {
  return Math.round(price * (discount / 100));
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const CATEGORIES = [
  { name: "Electronics", icon: "💻", slug: "electronics", color: "#2874F0" },
  { name: "Fashion", icon: "👗", slug: "fashion", color: "#E91E63" },
  { name: "Home & Kitchen", icon: "🏠", slug: "home-kitchen", color: "#FF9F00" },
  { name: "Books", icon: "📚", slug: "books", color: "#388E3C" },
  { name: "Sports", icon: "⚽", slug: "sports", color: "#F44336" },
  { name: "Beauty", icon: "💄", slug: "beauty", color: "#9C27B0" },
  { name: "Toys", icon: "🎮", slug: "toys", color: "#00BCD4" },
  { name: "Grocery", icon: "🛒", slug: "grocery", color: "#4CAF50" },
];

export const ORDER_STATUSES = {
  PENDING: { label: "Pending", color: "text-yellow-600 bg-yellow-50" },
  CONFIRMED: { label: "Confirmed", color: "text-blue-600 bg-blue-50" },
  PROCESSING: { label: "Processing", color: "text-indigo-600 bg-indigo-50" },
  SHIPPED: { label: "Shipped", color: "text-purple-600 bg-purple-50" },
  DELIVERED: { label: "Delivered", color: "text-green-600 bg-green-50" },
  CANCELLED: { label: "Cancelled", color: "text-red-600 bg-red-50" },
  REFUNDED: { label: "Refunded", color: "text-gray-600 bg-gray-50" },
};
