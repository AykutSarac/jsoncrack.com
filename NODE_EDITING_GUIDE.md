# Guide: Updating JSON When Node Values Change

## Overview

This guide explains how to update nested JSON values in the JSON Crack application when users edit node values in the graph visualization.

## Architecture

```
User clicks Edit Button
         ↓
Node Edit Modal Opens
         ↓
User enters new value
         ↓
User clicks Save
         ↓
updateNodeValue(path, newValue) called
         ↓
updateJsonByPath() processes update
         ↓
useJson store updates
         ↓
useGraph re-parses with jsonParser
         ↓
Nodes/edges updated in graph store
         ↓
GraphView re-renders with new data
```

## Core Components

### 1. `src/lib/utils/updateJsonByPath.ts`

**Purpose**: Low-level JSON mutation utilities

**Key Functions**:

#### `updateJsonByPath(json, path, newValue)`
- Takes stringified JSON, JSONPath, and new value
- Parses the value intelligently
- Returns updated JSON string
- Handles errors gracefully

Example:
```typescript
const json = '{"user":{"name":"John"}}';
const updated = updateJsonByPath(json, ["user", "name"], "Jane");
// Result: '{"user":{"name":"Jane"}}'
```

#### `parseValueInput(input)`
- Converts string input to appropriate JavaScript type
- Rules:
  - `"true"` → `true` (boolean)
  - `"false"` → `false` (boolean)
  - `"null"` → `null`
  - `"123"` → `123` (number)
  - `"[1,2,3]"` → `[1, 2, 3]` (array)
  - `'{"a":1}'` → `{a: 1}` (object)
  - Anything else → string

#### `setNestedValue(obj, path, value)`
- Low-level utility to set value in nested object
- Mutates the object directly
- Creates intermediate objects/arrays as needed

#### `getJsonValueByPath(json, path)`
- Read a value from JSON by path
- Returns `undefined` if path doesn't exist

#### `isValidJson(json)`
- Validates JSON string syntax
- Returns boolean

### 2. `src/store/useJson.ts` (Updated)

**New Action Added**:

```typescript
updateNodeValue: (path: JSONPath | undefined, newValue: string) => void
```

**What it does**:
1. Calls `updateJsonByPath()` to update JSON
2. Updates the `json` state
3. Calls `useGraph.getState().setGraph(json)` to re-parse
4. Automatically updates nodes/edges and re-renders

**Usage**:
```typescript
import useJson from "../store/useJson";

const { updateNodeValue } = useJson();
updateNodeValue(["user", "name"], "Jane");
```

### 3. `src/features/modals/NodeEditModal/index.tsx` (Example)

Complete modal implementation showing:
- Storing original value
- Editing with preview
- Save with graph re-render
- Cancel to revert changes

## JSONPath Explained

JSONPath is an array of keys/indices:

For JSON: `{ "user": { "profile": { "email": "test@example.com" } } }`

| Path | Value |
|------|-------|
| `[]` | Entire object |
| `["user"]` | `{ "profile": {...} }` |
| `["user", "profile"]` | `{ "email": "..." }` |
| `["user", "profile", "email"]` | `"test@example.com"` |

For JSON: `{ "items": [{ "id": 1 }, { "id": 2 }] }`

| Path | Value |
|------|-------|
| `["items"]` | Array |
| `["items", 0]` | First item `{ "id": 1 }` |
| `["items", 0, "id"]` | `1` |
| `["items", 1, "id"]` | `2` |

## Usage Examples

### Example 1: Simple Update

```typescript
import useJson from "../store/useJson";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";

const MyComponent = () => {
  const selectedNode = useGraph(state => state.selectedNode);
  const { updateNodeValue } = useJson();

  const handleEdit = (newValue: string) => {
    if (selectedNode) {
      updateNodeValue(selectedNode.path, newValue);
    }
  };

  return <button onClick={() => handleEdit("new value")}>Update</button>;
};
```

### Example 2: In Modal with Validation

```typescript
const handleSave = () => {
  if (selectedNode && tempValue !== originalValue) {
    updateNodeValue(selectedNode.path, tempValue);
    onClose();
  }
};
```

### Example 3: Type-Aware Updates

```typescript
// User enters "123" → becomes number 123
updateNodeValue(["count"], "123");

// User enters '{"x":1}' → becomes object {x: 1}
updateNodeValue(["location"], '{"x":1}');

// User enters "hello" → stays string "hello"
updateNodeValue(["name"], "hello");
```

## Data Flow

```
Modal receives selectedNode from useGraph
         ↓
Node has .path property (JSONPath array)
         ↓
User edits value in TextInput
         ↓
Click Save button
         ↓
updateNodeValue(selectedNode.path, tempValue)
         ↓
useJson.updateNodeValue() called
         ↓
updateJsonByPath() creates new JSON string
         ↓
set({ json: updatedJson }) updates store
         ↓
useGraph.setGraph(updatedJson) called
         ↓
parser() re-parses JSON to nodes/edges
         ↓
Graph state updated with new nodes
         ↓
GraphView component re-renders
         ↓
User sees updated visualization
```

## Error Handling

The `updateJsonByPath` function handles errors gracefully:
- Invalid JSON syntax → returns original JSON
- Invalid paths → silently ignored
- Parse failures → default to string

For production, consider:
1. Validate JSON before updating
2. Show error messages to user
3. Log errors for debugging

Example:
```typescript
import { isValidJson } from "../lib/utils/updateJsonByPath";

const handleSave = () => {
  if (!isValidJson(json)) {
    showError("Invalid JSON");
    return;
  }
  updateNodeValue(path, value);
};
```

## Testing

Test examples for `updateJsonByPath`:

```typescript
// Test simple update
const json1 = '{"name":"John"}';
const result1 = updateJsonByPath(json1, ["name"], "Jane");
assert(result1 === '{"name":"Jane"}');

// Test nested update
const json2 = '{"user":{"name":"John"}}';
const result2 = updateJsonByPath(json2, ["user", "name"], "Jane");
assert(JSON.parse(result2).user.name === "Jane");

// Test array update
const json3 = '{"items":[{"id":1}]}';
const result3 = updateJsonByPath(json3, ["items", 0, "id"], "999");
assert(JSON.parse(result3).items[0].id === 999);

// Test type parsing
assert(parseValueInput("123") === 123);
assert(parseValueInput("true") === true);
assert(parseValueInput("null") === null);
assert(parseValueInput("hello") === "hello");
```

## Advanced Patterns

### Batch Updates
Update multiple values and re-parse once:

```typescript
let json = useJson.getState().json;
const updates = [
  [["user", "name"], "Jane"],
  [["user", "age"], "30"],
];

for (const [path, value] of updates) {
  json = updateJsonByPath(json, path, value);
}

useJson.setState({ json });
useGraph.getState().setGraph(json);
```

### Undo/Redo
Save original before update:

```typescript
const originalJson = useJson.getState().json;
updateNodeValue(path, newValue);

// Later: undo
useJson.setState({ json: originalJson });
useGraph.getState().setGraph(originalJson);
```

### Validation
Validate before saving:

```typescript
const validator = (value) => typeof value === "number" && value > 0;

if (!validator(parseValueInput(tempValue))) {
  showError("Value must be positive number");
  return;
}

updateNodeValue(path, tempValue);
```

## Files Modified/Created

1. **Created**: `src/lib/utils/updateJsonByPath.ts`
   - Core update utilities
   
2. **Updated**: `src/store/useJson.ts`
   - Added `updateNodeValue` action
   
3. **Created**: `src/features/modals/NodeEditModal/index.tsx`
   - Example modal implementation

## Next Steps

1. Integrate the edit button into `CustomNode` component
2. Hook up the modal to show/hide based on edit action
3. Add validation as needed for your use case
4. Consider adding undo/redo history if desired
5. Test with various data types and nested structures
