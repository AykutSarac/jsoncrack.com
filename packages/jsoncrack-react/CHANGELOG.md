# Changelog

All notable changes to `jsoncrack-react` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2026-04-10

### Fixed

- Graph now lands correctly centered on initial load and on every Fit click.
- Graph re-centers when the host container is resized.
- Edge labels use a sans-serif font regardless of host-page CSS.

### Added

- Basic screen-reader affordance on the canvas (`role="img"` +
  `aria-label="JSON data visualization"`).

### Changed

- `json` prop type narrowed from `string | object | unknown[]` to
  `string | object`. Arrays are still accepted — no consumer action required.

## [1.0.1]

Initial published version.
