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
    BLACK_DARK: string;
    BLACK_PRIMARY: string;
    BLACK_SECONDARY: string;
    CRIMSON: string;
    DARK_SALMON: string;
    DANGER: string;
    SEAGREEN: string;
    ORANGE: string;
    SILVER: string;
  }
}
