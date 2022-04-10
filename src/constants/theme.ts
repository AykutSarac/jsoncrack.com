import { DefaultTheme } from "styled-components";

export const darkTheme: DefaultTheme = {
  BLURPLE: "#5865F2",
  FULL_WHITE: "#FFFFFF",
  BLACK: "#202225",
  BLACK_DARK: "#2C2F33",
  BLACK_LIGHT: "#2F3136",
  BLACK_PRIMARY: "#36393f",
  BLACK_SECONDARY: "#23272A",
  CRIMSON: "#DC143C",
  DARK_SALMON: "#E9967A",
  DANGER: "#db662e",
  LIGHTGREEN: "#90EE90",
  SEAGREEN: "#3BA55D",
  ORANGE: "#FAA81A",
  SILVER: "#B9BBBE",
  SILVER_DARK: "#4D4D4D",

  INTERACTIVE_NORMAL: "#b9bbbe",
  INTERACTIVE_HOVER: "#dcddde",
  INTERACTIVE_ACTIVE: "#fff",
  BACKGROUND_TERTIARY: "#202225",
  BACKGROUND_SECONDARY: "#2f3136",
  BACKGROUND_PRIMARY: "#36393f",
  BACKGROUND_MODIFIER_ACCENT: "rgba(79,84,92,0.48)",
  TEXT_NORMAL: "#dcddde",
  TEXT_POSITIVE: "hsl(139,calc(var(--saturation-factor, 1)*51.6%),52.2%)",
  TEXT_DANGER: "hsl(359,calc(var(--saturation-factor, 1)*82%),73.9%)"
} as const;
