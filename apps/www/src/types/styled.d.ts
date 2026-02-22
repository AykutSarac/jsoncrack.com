/* eslint-disable @typescript-eslint/no-empty-object-type */
import "styled-components";
import type theme from "../constants/theme";

type CustomTheme = typeof theme;

declare module "styled-components" {
  export interface DefaultTheme extends CustomTheme {}
}
