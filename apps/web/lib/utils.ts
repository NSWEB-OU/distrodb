import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Distro images may be absolute (S3/CDN URLs) or a legacy relative path.
export function toAbsoluteUrl(base: string, path: string | undefined | null): string | undefined {
  if (!path) return undefined;
  return /^https?:\/\//.test(path) ? path : `${base}${path}`;
}
