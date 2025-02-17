export function isIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
