import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

// Generate RFC4122 v4 UUID. Uses `crypto.randomUUID()` when available,
// otherwise falls back to `crypto.getRandomValues` so it works on older/mobile browsers.
export function generateId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
      return (crypto as any).randomUUID();
    }
  } catch (_) {
    // ignore and fall back
  }

  const getRandomValues =
    (typeof crypto !== 'undefined' && (crypto as any).getRandomValues && ((crypto as any).getRandomValues).bind(crypto)) ||
    // @ts-ignore - for older IE fallback (unlikely in this app)
    (typeof (window as any).msCrypto !== 'undefined' && (window as any).msCrypto.getRandomValues && (window as any).msCrypto.getRandomValues.bind((window as any).msCrypto));

  if (!getRandomValues) {
    // Last resort: pseudo random (not ideal, but avoids throwing)
    return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  const buf = new Uint8Array(16);
  getRandomValues(buf as any);

  // Per RFC4122 section 4.4
  buf[6] = (buf[6] & 0x0f) | 0x40;
  buf[8] = (buf[8] & 0x3f) | 0x80;

  const hex: string[] = Array.from(buf).map((b) => b.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
}
