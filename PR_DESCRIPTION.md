PR Title: Add edit-in-visualization for Node Content modal (Edit / Save / Cancel) and sync with left editor

Summary

This PR adds an "Edit" workflow to the Node Content modal used in the graph visualization. Users can now edit the JSON value for a selected node directly in the visualization modal. When they Save, the left-hand editor's contents are updated and the graph is re-parsed. A success toast is displayed on save and an error toast is shown for invalid JSON.

Key changes

- `src/features/modals/NodeModal/index.tsx`

  - Added Edit button and editing UI (Textarea) with Save and Cancel.
  - Implemented `setAtPath` helper to replace the JSON value at the node's path.
  - On Save: validate JSON, update editor contents via `useFile.setContents`, update `useJson.setJson`, attempt to preserve the edited node selection, and show toast notifications.

- `scripts/normalize-line-endings.js`

  - Development helper used to normalize CRLF -> LF in `src`, `pages`, and `public` directories.

- `CHANGELOG.md` and `PR_DESCRIPTION.md` (this file)
  - Documentation for reviewers and release notes.

Why this change

- Improves UX by letting power users edit nodes inline without switching to the left-hand editor.
- Keeps the left-hand canonical editor in sync so edits remain source-of-truth.

How to test manually (smoke test)

1. Install and run the app locally:

```powershell
pnpm install
pnpm dev
```

2. Open the app in a browser (likely at http://localhost:3000 or http://localhost:3001 if 3000 is in use).
3. Open the Editor view and load some JSON into the left editor (or use the example data provided).
4. In the visualization, click a node to open the Node Content modal (or open it via the UI).
5. Click "Edit", change the JSON value in the textarea (for primitives use a quoted string when appropriate), then click "Save".
6. Verify:
   - A toast appears saying "Saved".
   - The left-hand editor's content updates to reflect the edit.
   - The visualization updates (graph node content updated). If selection can be resolved after re-parse, the same node remains selected.
7. Try invalid JSON in the editor and click Save — verify an error toast and inline error message appear.

Notes for reviewers

- The selection-preservation logic uses JSONPath equality (stringified) to try and match nodes after the graph is rebuilt. This works for straightforward edits. If the structure changes drastically, the node may not be found; that is non-fatal and the code falls back gracefully.
- The change relies on `useFile.setContents` and `useJson.setJson` to keep the left editor and graph in sync. Unit tests for `setAtPath` would be useful if we expand coverage.

Files to check

- `src/features/modals/NodeModal/index.tsx` — main changes
- `src/store/useFile.ts` and `src/store/useJson.ts` — store usage (read-only in this PR)

Follow-up work / optional

- Add a unit test for `setAtPath` to validate nested arrays/objects and root replacement behavior.
- Add UX tweak to optionally keep modal open after save (if users prefer in-place iterative edits).
