# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Edit-in-visualization: added an Edit button to the Node Content modal that opens an inline editor where users can edit node JSON and Save/Cancel.
- Toast notifications for save success and JSON parse/save errors.
- Preservation of node selection after saving an edited node (when possible).

### Changed

- `src/features/modals/NodeModal/index.tsx` updated to include the editing UI, save/cancel handling, and syncing with `useFile` and `useJson` stores.

### Files touched

- src/features/modals/NodeModal/index.tsx — main implementation
- scripts/normalize-line-endings.js — utility used during development to normalize line endings across the repo

## [Previous]

- See repository releases for older entries.
