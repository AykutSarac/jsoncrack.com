# Summary: JSON Node Update Implementation

## Overview
This document summarizes the implementation for updating JSON values when node values change in the graph visualization.

## Files Created/Modified

### 1. ✅ CREATED: `src/lib/utils/updateJsonByPath.ts`
**Purpose**: Core utility functions for updating nested JSON by path

**Key Functions**:
- `updateJsonByPath(json, path, newValue)` - Main function to update JSON
- `parseValueInput(input)` - Intelligent type conversion
- `setNestedValue(obj, path, value)` - Low-level path setter
- `getJsonValueByPath(json, path)` - Read values by path
- `isValidJson(json)` - Validate JSON syntax

**How it works**:
1. Parses JSON string to object
2. Navigates to the path using the array of keys/indices
3. Sets the value at that location
4. Returns stringified JSON
5. On error, returns original JSON unchanged

### 2. ✅ MODIFIED: `src/store/useJson.ts`
**What changed**: Added new action `updateNodeValue`

**Before**:
```typescript
interface JsonActions {
  setJson: (json: string) => void;
  getJson: () => string;
  clear: () => void;
}
```

**After**:
```typescript
interface JsonActions {
  setJson: (json: string) => void;
  getJson: () => string;
  clear: () => void;
  updateNodeValue: (path: JSONPath | undefined, newValue: string) => void;
}
```

**New Action Implementation**:
```typescript
updateNodeValue: (path: JSONPath | undefined, newValue: string) => {
  const currentJson = get().json;
  const updatedJson = updateJsonByPath(currentJson, path, newValue);
  
  set({ json: updatedJson });
  useGraph.getState().setGraph(updatedJson);
}
```

**What it does**:
1. Calls `updateJsonByPath()` to get updated JSON
2. Updates the `json` state in Zustand store
3. Automatically calls `useGraph.setGraph()` which:
   - Re-parses JSON to nodes/edges
   - Updates graph visualization
   - Triggers re-render

### 3. ✅ CREATED: `src/features/modals/NodeEditModal/index.tsx`
**Purpose**: Example modal component showing complete edit workflow

**Features**:
- Opens with selected node data
- Stores original value for cancel functionality
- Shows JSON path in readable format
- Displays preview of new value
- Type detection (shows whether value is string, number, object, etc.)
- Save button (updates JSON and graph)
- Cancel button (reverts without updating)

## Data Flow

```
User clicks Edit Button on Node
         ↓
handleEditClick() stores selectedNode
         ↓
NodeEditModal opens with node data
         ↓
User enters new value in TextInput
         ↓
User clicks Save
         ↓
updateNodeValue(selectedNode.path, tempValue) called
         ↓
updateJsonByPath() processes:
  - Parse JSON string to object
  - Navigate to path (e.g., ["user", "name"])
  - Set new value
  - Return updated JSON string
         ↓
useJson store updates json state
         ↓
useGraph.setGraph(updatedJson) called automatically
         ↓
Graph parser re-parses JSON to nodes/edges
         ↓
Nodes and edges updated in useGraph store
         ↓
GraphView re-renders with new visualization
         ↓
User sees updated graph with new values
```

## JSONPath Concept

JSONPath is an array path to a value in JSON:

```javascript
// Example JSON
{
  "user": {
    "name": "John",
    "addresses": [
      { "street": "123 Main", "city": "NY" },
      { "street": "456 Elm", "city": "LA" }
    ]
  }
}

// Paths:
["user"]                                    → { "name": "John", "addresses": [...] }
["user", "name"]                            → "John"
["user", "addresses"]                       → [...]
["user", "addresses", 0]                    → { "street": "123 Main", "city": "NY" }
["user", "addresses", 0, "city"]            → "NY"
["user", "addresses", 1, "city"]            → "LA"
```

## Type Conversion

The `parseValueInput()` function automatically converts user input:

| User Input | Result | Type |
|-----------|--------|------|
| `"true"` | `true` | boolean |
| `"false"` | `false` | boolean |
| `"null"` | `null` | null |
| `"123"` | `123` | number |
| `"-45.67"` | `-45.67` | number |
| `"[1,2,3]"` | `[1,2,3]` | array |
| `'{"x":1}'` | `{x:1}` | object |
| `"hello"` | `"hello"` | string |

## Usage Example

In a React component:

```typescript
import useJson from "../store/useJson";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";

const MyEditComponent = () => {
  const selectedNode = useGraph(state => state.selectedNode);
  const { updateNodeValue } = useJson();
  const [tempValue, setTempValue] = React.useState("");

  const handleSave = () => {
    // selectedNode.path contains the JSONPath
    // e.g., ["user", "profile", "email"]
    updateNodeValue(selectedNode.path, tempValue);
    // Graph automatically updates!
  };

  return (
    <div>
      <input 
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};
```

## How Node Paths Are Created

The graph nodes contain `.path` property from the `jsonParser`:

```typescript
// In jsonParser.ts
nodes.push({
  id,
  text,
  width,
  height,
  path: getNodePath(node),  // ← JSONPath from jsonc-parser library
});
```

The `getNodePath()` function from `jsonc-parser` library traces the node's position in the JSON structure and returns the path array.

## Error Handling

The `updateJsonByPath()` function includes error handling:

```typescript
try {
  // ... update logic
  return JSON.stringify(obj);
} catch (error) {
  console.error("Error updating JSON:", error);
  return json; // Return original on error
}
```

- Invalid JSON syntax → returns original
- Invalid paths → silently ignored
- Parse failures → defaults to string type

## What Happens Automatically

When you call `updateNodeValue()`:

1. ✅ JSON in store is updated
2. ✅ Graph is re-parsed to nodes/edges
3. ✅ All nodes updated with new data
4. ✅ All edges updated
5. ✅ GraphView re-renders
6. ✅ User sees updated visualization

You don't need to manually:
- Update the graph
- Re-parse JSON
- Trigger re-renders
- Update node positions

It all happens automatically!

## Next Steps to Integrate

1. **Add edit button to CustomNode** (follow the earlier proposal)
2. **Update modal controller** to include `NodeEditModal`
3. **Hook up the open/close** logic
4. **Add validation** if needed for your use case
5. **Add undo/redo** (optional, can save original JSON)

## Files at a Glance

| File | Purpose | Status |
|------|---------|--------|
| `src/lib/utils/updateJsonByPath.ts` | Core update utilities | ✅ Created |
| `src/store/useJson.ts` | Updated with new action | ✅ Modified |
| `src/features/modals/NodeEditModal/index.tsx` | Example modal | ✅ Created |
| `src/NODE_EDITING_GUIDE.md` | Detailed documentation | ✅ Created |
| `src/UPDATE_JSON_QUICK_REFERENCE.ts` | Quick reference | ✅ Created |

## Key Insights

1. **Path-based updates** - Uses JSONPath array to locate values
2. **Type-smart parsing** - Automatically converts strings to appropriate types
3. **Automatic graph update** - No manual re-render needed
4. **Error resilient** - Returns original JSON if update fails
5. **Non-destructive** - Can easily implement undo/redo
6. **Follows existing patterns** - Uses Zustand like rest of codebase

## Testing

Test the implementation with:

```javascript
// Simple object
updateNodeValue(["name"], "NewName")

// Nested object
updateNodeValue(["user", "profile", "email"], "new@example.com")

// Array element
updateNodeValue(["items", 0, "id"], "999")

// Type conversion
updateNodeValue(["count"], "42")  // Becomes number
updateNodeValue(["active"], "true")  // Becomes boolean
updateNodeValue(["data"], '{"x":1}')  // Becomes object
```
