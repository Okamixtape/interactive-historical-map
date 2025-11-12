// lib/utils.ts

/**
 * Merge class names utility
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
