# JSON Text Editor Integration Guide

## Overview

The left-hand JSON editor has a **two-way data flow**:

```
User types in editor → useFile.setContents() → useJson.setJson() → Graph updates
                                                    ↓
Graph node edited → useJson.handleSave() → useJson.setJson() → Editor updates (via useFile)
```

---

## Current Flow: Where Editor Gets Its Value

### 1. TextEditor Component (`src/features/editor/TextEditor.tsx`)

```tsx
const TextEditor = () => {
  // ✅ Gets JSON text from useFile store
  const contents = useFile(state => state.contents);
  const setContents = useFile(state => state.setContents);
  
  return (
    <Editor
      value={contents}  // ← Displays in editor
      onChange={contents => setContents({ contents, skipUpdate: true })}
      // ... other props
    />
  );
};
```

**Key Points:**
- `value={contents}` - Editor displays this text
- `onChange` - When user types, calls `setContents()`
- Component subscribes to `useFile` store
- Automatically re-renders when `contents` changes

### 2. useFile Store (`src/store/useFile.ts`)

```typescript
// Manages text editor contents
const initialStates = {
  contents: defaultJson,  // ← Initial value
  format: FileFormat.JSON,
  hasChanges: false,
  // ...
};

const useFile = create<FileStates & JsonActions>()((set, get) => ({
  setContents: async ({ contents, hasChanges = true, skipUpdate = false }) => {
    set({
      contents,  // ← Updates editor text
      hasChanges,
      format: format ?? get().format,
    });
    
    // Parse and send to JSON store
    const json = await contentToJson(get().contents, get().format);
    debouncedUpdateJson(json);  // ← Debounced, 400ms delay
  },
}));
```

---

## Current Flow: How Editor Updates When JSON Changes

### The Reverse Direction (Graph → Editor)

When you edit a node in the graph:

```
1. User clicks edit button on node
   ↓
2. handleSave(path, newValue) called
   ↓
3. useJson.setJson(updatedJson)
   ↓
4. ??? Editor needs to know JSON changed
```

**Currently:** The editor does NOT automatically update when graph nodes are edited.

---

## Solution: Update Editor When JSON Changes

You need to add a subscription in `useFile` that watches `useJson` changes.

### Option 1: Add useEffect in TextEditor Component (SIMPLE)

```tsx
import React, { useEffect } from "react";
import useFile from "../../store/useFile";
import useJson from "../../store/useJson";

const TextEditor = () => {
  const contents = useFile(state => state.contents);
  const setContents = useFile(state => state.setContents);
  const json = useJson(state => state.json);

  // ✅ When JSON changes from graph edits, update editor
  useEffect(() => {
    if (json && contents !== json) {
      setContents({ 
        contents: json, 
        hasChanges: false,  // Don't mark as unsaved change
        skipUpdate: true    // Don't re-parse (it's already parsed)
      });
    }
  }, [json, contents, setContents]);

  return (
    <Editor
      value={contents}
      onChange={contents => setContents({ contents, skipUpdate: true })}
      // ... rest of component
    />
  );
};
```

**Pros:**
- Simple, localized to one component
- Easy to understand
- Works immediately

**Cons:**
- Duplicates logic if needed elsewhere
- Slightly heavier subscription

---

### Option 2: Add to useFile Store (BETTER - Centralized)

Add a subscription in `useFile` that updates editor when JSON changes:

```typescript
// In src/store/useFile.ts - Add this after the create() function:

// ✅ Subscribe to useJson changes and update editor
useFile.subscribe(
  state => state.contents,
  () => {
    // When editor contents change, we already update JSON
    // This is the user typing scenario
  }
);

// ✅ When JSON store changes from graph edits, update editor
useJson.subscribe(
  state => state.json,
  (json) => {
    const editorContents = useFile.getState().contents;
    
    // Only update if JSON actually changed (and came from graph, not editor)
    if (json && editorContents !== json) {
      useFile.setState({
        contents: json,
        hasChanges: false,
        // Don't trigger re-parse since it's already parsed
      });
    }
  }
);
```

**Place this after the `export default useFile;` line:**

```typescript
export default useFile;

// ✅ Auto-sync editor when graph JSON changes
useJson.subscribe(
  (state) => state.json,
  (json) => {
    const currentContents = useFile.getState().contents;
    if (json && currentContents !== json) {
      useFile.setState({
        contents: json,
        hasChanges: false,
      });
    }
  }
);
```

---

## RECOMMENDED: Add to useJson.ts (CLEANEST)

Since the change originates from `useJson.handleSave()`, handle the sync there:

```typescript
// In src/store/useJson.ts

handleSave: (path: JSONPath | undefined, newValue: string) => {
  const currentJson = get().json;
  const updatedJson = updateJsonByPath(currentJson, path, newValue);
  
  // Update JSON and graph
  set({ json: updatedJson });
  useGraph.getState().setGraph(updatedJson);
  
  // ✅ NEW: Update editor text
  useFile.getState().setContents({
    contents: updatedJson,
    hasChanges: false,
    skipUpdate: true,  // Already parsed
  });
},
```

**Why this is best:**
- Changes happen at the source (handleSave)
- No extra subscriptions needed
- Explicit and clear
- Prevents circular updates

---

## Complete Updated useJson.ts

Add the import at the top:

```typescript
import useFile from "./useFile";
```

Then update `handleSave`:

```typescript
handleSave: (path: JSONPath | undefined, newValue: string) => {
  const currentJson = get().json;
  const updatedJson = updateJsonByPath(currentJson, path, newValue);
  
  // Update JSON state and re-parse graph
  set({ json: updatedJson });
  useGraph.getState().setGraph(updatedJson);
  
  // ✅ Sync editor text with updated JSON
  useFile.getState().setContents({
    contents: updatedJson,
    hasChanges: false,
    skipUpdate: true,
  });
},
```

---

## Data Flow After Implementation

```
┌─────────────────────────────────────────┐
│ Scenario 1: User types in editor        │
└──────────────────┬──────────────────────┘
                   │
        TextEditor onChange
                   │
                   ▼
        useFile.setContents()
                   │
        (400ms debounce)
                   │
                   ▼
        useJson.setJson()
                   │
                   ▼
        useGraph.setGraph()
                   │
                   ▼
        Graph visualization updates


┌──────────────────────────────────────────┐
│ Scenario 2: User edits node in graph     │
└───────────────────┬──────────────────────┘
                    │
       User clicks Save in editor
                    │
                    ▼
       useJson.handleSave()
                    │
         ┌──────────┴──────────┐
         │                     │
         ▼                     ▼
    set { json }        setGraph()
         │                     │
         │              Graph re-parses
         │
         ▼
    ✅ useFile.setContents()
         │
         ▼
    Editor text updates
         │
         ▼
    TextEditor re-renders
```

---

## Type Definitions

```typescript
// useFile.setContents() parameters
type SetContents = {
  contents?: string;        // New editor text
  hasChanges?: boolean;     // Mark as modified (true) or saved (false)
  skipUpdate?: boolean;     // Skip graph re-parse if true
  format?: FileFormat;      // File format (JSON, YAML, CSV, etc.)
};

// When calling from handleSave:
useFile.getState().setContents({
  contents: updatedJson,    // ← Updated JSON string
  hasChanges: false,        // ← Don't mark as unsaved
  skipUpdate: true,         // ← Already parsed
});
```

---

## Complete Code Example: useJson.ts

```typescript
import { create } from "zustand";
import type { JSONPath } from "jsonc-parser";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";
import useNodeEdit from "../features/editor/views/GraphView/stores/useNodeEdit";
import useFile from "./useFile";  // ← ADD THIS IMPORT
import { updateJsonByPath } from "../lib/utils/updateJsonByPath";

interface JsonActions {
  setJson: (json: string) => void;
  getJson: () => string;
  clear: () => void;
  updateNodeValue: (path: JSONPath | undefined, newValue: string) => void;
  handleSave: (path: JSONPath | undefined, newValue: string) => void;
  handleCancel: () => void;
}

const initialStates = {
  json: "{}",
  loading: true,
};

export type JsonStates = typeof initialStates;

const useJson = create<JsonStates & JsonActions>()((set, get) => ({
  ...initialStates,
  getJson: () => get().json,
  setJson: json => {
    set({ json, loading: false });
    useGraph.getState().setGraph(json);
  },
  clear: () => {
    set({ json: "", loading: false });
    useGraph.getState().clearGraph();
  },
  updateNodeValue: (path: JSONPath | undefined, newValue: string) => {
    const currentJson = get().json;
    const updatedJson = updateJsonByPath(currentJson, path, newValue);
    
    set({ json: updatedJson });
    useGraph.getState().setGraph(updatedJson);
  },
  handleSave: (path: JSONPath | undefined, newValue: string) => {
    const currentJson = get().json;
    const updatedJson = updateJsonByPath(currentJson, path, newValue);
    
    // Update JSON state and re-parse graph
    set({ json: updatedJson });
    useGraph.getState().setGraph(updatedJson);
    
    // ✅ NEW: Sync editor text with updated JSON
    useFile.getState().setContents({
      contents: updatedJson,
      hasChanges: false,
      skipUpdate: true,
    });
  },
  handleCancel: () => {
    useNodeEdit.getState().stopEdit();
  },
}));

export default useJson;
```

---

## Testing the Integration

### Test Case 1: Edit via Editor
1. Open JSON Crack
2. Type in left editor
3. Verify graph updates ✓ (already works)
4. Verify "Unsaved changes" indicator ✓ (already works)

### Test Case 2: Edit via Graph Node
1. Open JSON Crack with sample JSON
2. Click edit button on a node
3. Change value
4. Click Save
5. **Verify left editor text updates** ✓ (new)
6. **Verify no "Unsaved changes" indicator** ✓ (new)

### Test Case 3: Multiple Edits
1. Edit node in graph
2. Verify editor syncs
3. Edit another node
4. Verify editor syncs again
5. Verify graph nodes all have correct values

---

## Summary

| Component | Role | Gets Value From |
|-----------|------|-----------------|
| **TextEditor** | Monaco editor UI | useFile.contents |
| **useFile** | Text state + format | User input + useJson |
| **useJson** | JSON data + graph | useFile + graph edits |
| **useGraph** | Visualization | useJson (parsed) |

**Current Gap:** When graph nodes are edited, editor doesn't update.

**Solution:** Call `useFile.setContents()` from `useJson.handleSave()` to keep editor in sync.

**Implementation:** Add 1 import + 6 lines of code to `handleSave()`.
