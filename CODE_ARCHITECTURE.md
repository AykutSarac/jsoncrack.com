# Code Architecture: JSON Node Update System

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      GraphView                               │
│         (Renders nodes with edit button)                    │
└───────────────────────────┬─────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │ Edit Button     │
                    │ Clicked         │
                    └────────┬────────┘
                             │
                    ┌────────▼──────────────┐
                    │ NodeEditModal         │
                    │ (opened with node)    │
                    │ - Input field         │
                    │ - Preview            │
                    │ - Save/Cancel buttons│
                    └────────┬──────────────┘
                             │
                    ┌────────▼──────────────────┐
                    │ User clicks Save         │
                    │ updateNodeValue() called │
                    └────────┬──────────────────┘
                             │
    ┌────────────────────────▼────────────────────────────┐
    │           useJson Store                             │
    │  updateNodeValue(path, newValue)                    │
    │  ├─ updateJsonByPath()                              │
    │  ├─ Updates json state                              │
    │  └─ Calls useGraph.setGraph()                       │
    └────────────────────┬─────────────────────────────────┘
                         │
    ┌────────────────────▼────────────────────────────────┐
    │           useGraph Store                            │
    │  setGraph(json)                                     │
    │  ├─ Calls parser(json)                              │
    │  ├─ Re-parses to nodes/edges                        │
    │  └─ Updates store state                             │
    └────────────────────┬─────────────────────────────────┘
                         │
    ┌────────────────────▼────────────────────────────────┐
    │           GraphView Re-renders                      │
    │  ├─ Nodes updated with new values                   │
    │  ├─ Edges reflect structure changes                 │
    │  └─ Visualization updates                           │
    └─────────────────────────────────────────────────────┘
```

## updateJsonByPath Function Flow

```
updateJsonByPath(json, path, newValue)
│
├─ Input validation
│  └─ Check if path exists and json is valid
│
├─ JSON.parse(json)
│  └─ Convert string to JavaScript object
│
├─ parseValueInput(newValue)
│  └─ Convert string value to appropriate type
│
├─ Navigate path
│  └─ For each element in path, move one level deeper:
│     ["user", "name"] → json.user.name
│
├─ Set value
│  └─ json.user.name = parsedValue
│
└─ JSON.stringify(updatedObject)
   └─ Return updated JSON string

Example:
  Input:  json = '{"user":{"name":"John"}}'
          path = ["user", "name"]
          newValue = "Jane"
  
  Process:
    1. Parse → {user: {name: "John"}}
    2. Navigate → user → name
    3. Set value → obj.user.name = "Jane"
    4. Stringify → '{"user":{"name":"Jane"}}'
```

## State Management Structure

```
Store: useJson
├─ State:
│  ├─ json: string (entire JSON as string)
│  └─ loading: boolean
│
└─ Actions:
   ├─ setJson(json) - Set entire JSON
   ├─ getJson() - Get current JSON
   ├─ clear() - Clear JSON
   └─ updateNodeValue(path, newValue) ← NEW
      ├─ Calls updateJsonByPath()
      ├─ Updates json state
      └─ Triggers graph re-parse

Store: useGraph
├─ State:
│  ├─ nodes: NodeData[]
│  ├─ edges: EdgeData[]
│  ├─ selectedNode: NodeData | null
│  └─ ... (other state)
│
└─ Actions:
   ├─ setGraph(json)
   │  ├─ Calls parser(json)
   │  ├─ Updates nodes and edges
   │  └─ Triggers re-render
   └─ ... (other actions)

Utility: updateJsonByPath.ts
├─ updateJsonByPath()     - Main update function
├─ parseValueInput()      - Type conversion
├─ setNestedValue()       - Low-level setter
├─ getJsonValueByPath()   - Read by path
└─ isValidJson()          - Validation
```

## Type Conversion Decision Tree

```
                      parseValueInput(input)
                             │
                    ┌────────▼────────┐
                    │ Trim whitespace │
                    └────────┬────────┘
                             │
                    ┌────────▼────────────────┐
                    │ Check if "true"?        ├─→ return true
                    └────────┬────────────────┘
                             │
                    ┌────────▼────────────────┐
                    │ Check if "false"?       ├─→ return false
                    └────────┬────────────────┘
                             │
                    ┌────────▼────────────────┐
                    │ Check if "null"?        ├─→ return null
                    └────────┬────────────────┘
                             │
                    ┌────────▼────────────────┐
                    │ Is it a number?         ├─→ return Number
                    │ (e.g., "123")           │
                    └────────┬────────────────┘
                             │
                    ┌────────▼────────────────────────┐
                    │ Is it JSON array/object?        │
                    │ (starts [ or {)                 │
                    └────────┬──────────────┬──────────┘
                             │ Yes          │ No
                    ┌────────▼────┐   ┌─────▼──────┐
                    │ Try JSON     │   │ Return as  │
                    │ parse        │   │ string     │
                    └──────┬───────┘   └────────────┘
                           │
                    ┌──────▼────────┐
                    │ Success?      │
                    └──┬─────────┬──┘
                   Yes│         │No
              ┌──────▼┐    ┌────▼──┐
              │Object │    │String │
              └───────┘    └───────┘
```

## Example: Complete Update Sequence

```
Initial JSON:
{
  "users": [
    { "id": 1, "name": "John" },
    { "id": 2, "name": "Jane" }
  ]
}

User clicks edit on first user's name node
├─ selectedNode.id = "3"
├─ selectedNode.path = ["users", 0, "name"]
└─ selectedNode.text[0].value = "John"

User types "Alice" and clicks Save
├─ handleSave()
├─ updateNodeValue(["users", 0, "name"], "Alice")
│
├─ useJson.updateNodeValue():
│  ├─ updateJsonByPath(currentJson, ["users", 0, "name"], "Alice")
│  ├─ Parse JSON to object
│  ├─ Navigate to users[0].name
│  ├─ Set value = "Alice"
│  ├─ Stringify back
│  ├─ set({ json: newJson })
│  └─ useGraph.getState().setGraph(newJson)
│
├─ useGraph.setGraph():
│  ├─ Call parser(newJson)
│  ├─ Re-parse to nodes/edges
│  ├─ Update nodes array (node 3 now has "Alice")
│  └─ Update store state
│
└─ GraphView re-renders:
   ├─ CustomNode receives updated node data
   ├─ Displays "Alice" instead of "John"
   └─ User sees change instantly

Final JSON:
{
  "users": [
    { "id": 1, "name": "Alice" },     ← Changed!
    { "id": 2, "name": "Jane" }
  ]
}
```

## File Dependencies

```
Features/Modals/NodeEditModal/index.tsx
├─ imports useGraph (read selectedNode)
├─ imports useJson (call updateNodeValue)
└─ displays node path and value

Store/useJson.ts
├─ imports updateJsonByPath from lib/utils
└─ implements updateNodeValue action

Lib/utils/updateJsonByPath.ts
├─ pure functions (no imports)
└─ exports 5 utility functions

Features/Editor/Views/GraphView/CustomNode/index.tsx
├─ imports useNodeEdit (optional - for edit state)
├─ implements edit button handler
└─ opens NodeEditModal

(All tied together via Zustand stores)
```

## Critical Points

1. **JSONPath is Key**: Each node has a `.path` property that uniquely identifies its location
2. **Type Safety**: Values are automatically converted to appropriate types
3. **Graph Auto-Update**: Calling `updateNodeValue()` automatically re-renders the graph
4. **Error Resilient**: If anything fails, original JSON is returned unchanged
5. **Follows Zustand Pattern**: Matches existing store patterns in codebase
6. **No Manual Updates**: Graph updates happen automatically, no manual re-parse needed

## Checklist for Integration

- [ ] `updateJsonByPath.ts` utility created ✅
- [ ] `useJson.ts` updated with `updateNodeValue` action ✅
- [ ] `NodeEditModal/index.tsx` example created ✅
- [ ] Add edit button to `CustomNode` component
- [ ] Register `NodeEditModal` in modal controller
- [ ] Test simple value updates
- [ ] Test nested object updates
- [ ] Test array element updates
- [ ] Test type conversions
- [ ] Add error handling/validation as needed
- [ ] Consider undo/redo functionality
