import { type MantineColorScheme, type MantineColorSchemeManager } from "@mantine/core";

export interface SmartColorSchemeManagerOptions {
  /** Local storage key used to retrieve value with `localStorage.getItem(key)` */
  key: string;
  /** Function that returns the current pathname */
  getPathname: () => string;
  /** Optional list of paths that should use the dynamic color scheme */
  dynamicPaths?: string[];
}

/**
 * Creates a smart color scheme manager that handles different behaviors based on the current path
 * - For editor paths: Uses dynamic behavior with localStorage persistence and per-tab independence
 * - For other paths: Forces light theme
 */
export function smartColorSchemeManager({
  key,
  getPathname,
  dynamicPaths = [],
}: SmartColorSchemeManagerOptions): MantineColorSchemeManager {
  // Keep track of theme in memory for dynamic paths
  let currentColorScheme: MantineColorScheme | null = null;

  // Helper function to check if current path should use dynamic behavior
  const shouldUseDynamicBehavior = () => {
    const pathname = getPathname();
    return dynamicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));
  };

  return {
    get: defaultValue => {
      // If not in a dynamic path (e.g., editor), always return light theme
      if (!shouldUseDynamicBehavior()) return "light";

      // For dynamic paths, use the stored value (memory first, then localStorage)
      if (currentColorScheme) return currentColorScheme;

      // First time initialization - read from localStorage
      if (typeof window === "undefined") return defaultValue;

      try {
        currentColorScheme =
          (window.localStorage.getItem(key) as MantineColorScheme) || defaultValue;
        return currentColorScheme;
      } catch {
        return defaultValue;
      }
    },

    set: value => {
      // Only store theme for dynamic paths
      if (!shouldUseDynamicBehavior()) return;

      // Update our in-memory value
      currentColorScheme = value;

      // Also save to localStorage
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        console.warn("Smart color scheme manager was unable to save color scheme.", error);
      }
    },

    // These do nothing regardless of path
    subscribe: () => {},
    unsubscribe: () => {},
    clear: () => {
      currentColorScheme = null;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    },
  };
}
