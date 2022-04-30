import "styled-components";

interface ThemeTones {
  readonly LOWLIGHT?: string;
  readonly BASE: string;
  readonly HIGHLIGHT?: string;
  readonly TINT?: string;
}

declare module "styled-components" {
  export interface DefaultTheme {
    BLURPLE: string;
    FULL_WHITE: string;
    BLACK: string;
    BLACK_LIGHT: string;
    BLACK_DARK: string;
    BLACK_PRIMARY: string;
    BLACK_SECONDARY: string;
    CRIMSON: string;
    DARK_SALMON: string;
    DANGER: string;
    LIGHTGREEN: string;
    SEAGREEN: string;
    ORANGE: string;
    SILVER: string;
    SILVER_DARK: string;
    PRIMARY: string;
    NODE_KEY: string;

    INTERACTIVE_NORMAL: string;
    INTERACTIVE_HOVER: string;
    INTERACTIVE_ACTIVE: string;
    BACKGROUND_NODE: string;
    BACKGROUND_TERTIARY: string;
    BACKGROUND_SECONDARY: string;
    BACKGROUND_PRIMARY: string;
    BACKGROUND_MODIFIER_ACCENT: string;
    TEXT_NORMAL: string;
    TEXT_POSITIVE: string;
    TEXT_DANGER: string;
  }
}
