# Privacy Policy for JSON Crack Chrome Extension

**Effective Date:** April 10, 2026

This Privacy Policy describes how the JSON Crack Chrome Extension (the "Extension") handles information.

## 1. Scope

This policy applies to the Chrome Extension published from this project.

## 2. Information Processed by the Extension

When active on a page, the Extension may:

- Read page text to determine whether the page contains JSON.
- Parse and render JSON content locally in the tab to provide graph visualization.
- Read system light/dark preference to set visual theme.
- Write to clipboard only when you click a copy button in the node modal.

## 3. Data Collection, Storage, and Sharing

As of the effective date above, the Extension is designed to minimize data handling:

- No account or sign-in is required.
- No analytics or telemetry SDK is included in the Extension source.
- No persistent storage is used for page JSON data (including `localStorage`, `sessionStorage`, `indexedDB`, or Chrome extension storage).
- Page JSON content is not automatically transmitted to JSON Crack servers.
- We do not sell personal information through the Extension.

## 4. External Links

The Extension does not send page JSON data to our servers.

The Extension can also open external URLs only when you click a link (for example attribution, upgrade links, or URL values in graph nodes). Any external site you open is governed by that site's own terms and privacy policy.

## 5. Permissions

The Extension uses a broad content-script match pattern (`<all_urls>`) so it can detect JSON pages across domains. As of April 10, 2026, the manifest does not request additional explicit Chrome API permissions.

## 6. Retention

JSON content handled by the Extension is processed in-memory within the active page context and is not intentionally retained by the Extension after the tab/session ends.

## 7. Changes to This Policy

We may update this policy. Any update will be reflected by changing the effective date above.

## 8. Contact

For privacy questions related to the Extension, use:

- https://github.com/AykutSarac/jsoncrack.com/issues
