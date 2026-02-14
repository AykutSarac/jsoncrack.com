import type { CanvasThemeMode } from "./types";

export interface JsonCrackTheme {
  NODE_COLORS: {
    TEXT: string;
    NODE_KEY: string;
    NODE_VALUE: string;
    INTEGER: string;
    NULL: string;
    BOOL: {
      FALSE: string;
      TRUE: string;
    };
    CHILD_COUNT: string;
    DIVIDER: string;
  };
  INTERACTIVE_NORMAL: string;
  BACKGROUND_NODE: string;
  BACKGROUND_MODIFIER_ACCENT: string;
  TEXT_POSITIVE: string;
  GRID_BG_COLOR: string;
  GRID_COLOR_PRIMARY: string;
  GRID_COLOR_SECONDARY: string;
}

export const themes: Record<CanvasThemeMode, JsonCrackTheme> = {
  dark: {
    NODE_COLORS: {
      TEXT: "#DCE5E7",
      NODE_KEY: "#59b8ff",
      NODE_VALUE: "#DCE5E7",
      INTEGER: "#e8c479",
      NULL: "#939598",
      BOOL: {
        FALSE: "#F85C50",
        TRUE: "#00DC7D",
      },
      CHILD_COUNT: "#FFFFFF",
      DIVIDER: "#383838",
    },
    INTERACTIVE_NORMAL: "#b9bbbe",
    BACKGROUND_NODE: "#2B2C3E",
    BACKGROUND_MODIFIER_ACCENT: "rgba(79,84,92,0.48)",
    TEXT_POSITIVE: "hsl(139,calc(var(--saturation-factor, 1)*51.6%),52.2%)",
    GRID_BG_COLOR: "#141414",
    GRID_COLOR_PRIMARY: "#1c1b1b",
    GRID_COLOR_SECONDARY: "#191919",
  },
  light: {
    NODE_COLORS: {
      TEXT: "#000000",
      NODE_KEY: "#761CEA",
      NODE_VALUE: "#535353",
      INTEGER: "#FD0079",
      NULL: "#afafaf",
      BOOL: {
        FALSE: "#FF0000",
        TRUE: "#748700",
      },
      CHILD_COUNT: "#535353",
      DIVIDER: "#e6e6e6",
    },
    INTERACTIVE_NORMAL: "#4f5660",
    BACKGROUND_NODE: "#F6F8FA",
    BACKGROUND_MODIFIER_ACCENT: "rgba(106,116,128,0.24)",
    TEXT_POSITIVE: "#008736",
    GRID_BG_COLOR: "#f7f7f7",
    GRID_COLOR_PRIMARY: "#ebe8e8",
    GRID_COLOR_SECONDARY: "#f2eeee",
  },
};
