export function isIframe() {
  try {
    if (typeof window === "undefined") return false;
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
