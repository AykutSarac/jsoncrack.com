/// <reference types="react-scripts" />

declare global {
  interface Window {
    acquireVsCodeApi?: () => any;
  }
}
