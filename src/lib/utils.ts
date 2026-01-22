import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TextSize } from "@/types/note"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function getTextSizeClasses(textSize: TextSize) {
  switch (textSize) {
    case 1:
      return {
        subject: 'text-[10px]',
        message: 'text-[10px]',
        date: 'text-[8px]',
        title: 'text-base',
        description: 'text-xs',
        label: 'text-xs',
        button: 'text-xs',
      };
    case 2:
      return {
        subject: 'text-xs',
        message: 'text-xs',
        date: 'text-[10px]',
        title: 'text-lg',
        description: 'text-sm',
        label: 'text-sm',
        button: 'text-sm',
      };
    case 4:
      return {
        subject: 'text-base',
        message: 'text-base',
        date: 'text-sm',
        title: 'text-2xl',
        description: 'text-base',
        label: 'text-base',
        button: 'text-base',
      };
    case 5:
      return {
        subject: 'text-lg',
        message: 'text-lg',
        date: 'text-base',
        title: 'text-3xl',
        description: 'text-lg',
        label: 'text-lg',
        button: 'text-lg',
      };
    default: // case 3
      return {
        subject: 'text-sm',
        message: 'text-sm',
        date: 'text-xs',
        title: 'text-xl',
        description: 'text-sm',
        label: 'text-sm',
        button: 'text-sm',
      };
  }
}

export const THEME_COLORS = {
  light: {
    background: '#d4c4a8',
    board: '#f5f0e8',
    text: '#5a4a2f',
    subtle: '#6b5638',
  },
  dark: {
    background: '#2a2520',
    board: '#3a3530',
    text: '#e0d5c5',
    subtle: '#c0b5a5',
  },
} as const;

export function getThemeColors(darkMode: boolean) {
  return darkMode ? THEME_COLORS.dark : THEME_COLORS.light;
}

export const DEFAULT_SWIMLANE_LABELS: Record<number, string[]> = {
  1: ['In Progress', 'Ready'],
  2: ['Backlog', 'In Progress', 'Ready'],
  3: ['Backlog', 'To Do', 'In Progress', 'Ready'],
  4: ['Backlog', 'To Do', 'In Progress', 'Review', 'Ready'],
  5: ['Backlog', 'To Do', 'In Progress', 'Review', 'Testing', 'Ready'],
};

// Generate RFC4122 v4 UUID. Uses `crypto.randomUUID()` when available,
// otherwise falls back to `crypto.getRandomValues` so it works on older/mobile browsers.
export function generateId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof (crypto.randomUUID).bind(crypto) === 'function') {
      return crypto.randomUUID();
    }
  } catch (_) {
    // print and and fall back
    console.log("error: " + _)
  }

  const getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues ? crypto.getRandomValues.bind(crypto) : null;
  
  if (!getRandomValues) {
    // Last resort: pseudo random (not ideal, but avoids throwing)
    return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  const buf = new Uint8Array(16);
  getRandomValues(buf);

  // Per RFC4122 section 4.4
  buf[6] = (buf[6] & 0x0f) | 0x40;
  buf[8] = (buf[8] & 0x3f) | 0x80;

  const hex: string[] = Array.from(buf).map((b) => b.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
}
