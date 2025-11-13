/**
 * QUICK REFERENCE: Updating JSON Values by Node Path
 */

// ============================================================================
// 1. BASIC USAGE
// ============================================================================

import useJson from "../store/useJson";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";

// Get the selected node
const selectedNode = useGraph(state => state.selectedNode);

// Get the update function
const { updateNodeValue } = useJson();

// Update a value
updateNodeValue(selectedNode.path, "new value");

// ============================================================================
// 2. IN A MODAL COMPONENT
// ============================================================================

const MyEditModal = () => {
  const selectedNode = useGraph(state => state.selectedNode);
  const { updateNodeValue } = useJson();
  const [tempValue, setTempValue] = React.useState("");

  const handleSave = () => {
    updateNodeValue(selectedNode.path, tempValue);
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

// ============================================================================
// 3. TYPE CONVERSION (AUTOMATIC)
// ============================================================================

updateNodeValue(path, "123");              // → number 123
updateNodeValue(path, "true");             // → boolean true
updateNodeValue(path, "null");             // → null
updateNodeValue(path, "[1,2,3]");          // → array [1,2,3]
updateNodeValue(path, '{"a":1}');          // → object {a:1}
updateNodeValue(path, "hello");            // → string "hello"

// ============================================================================
// 4. EXAMPLE: NESTED OBJECT UPDATE
// ============================================================================

// Original JSON:
// {
//   "user": {
//     "profile": {
//       "email": "old@example.com"
//     }
//   }
// }

const { updateNodeValue } = useJson();

// selectedNode.path = ["user", "profile", "email"]
updateNodeValue(selectedNode.path, "new@example.com");

// Result:
// {
//   "user": {
//     "profile": {
//       "email": "new@example.com"
//     }
//   }
// }

// ============================================================================
// 5. EXAMPLE: ARRAY ELEMENT UPDATE
// ============================================================================

// Original JSON:
// {
//   "items": [
//     { "id": 1, "name": "Item 1" },
//     { "id": 2, "name": "Item 2" }
//   ]
// }

// Update first item's name
// selectedNode.path = ["items", 0, "name"]
updateNodeValue(selectedNode.path, "Updated Item 1");

// Update second item's id
// selectedNode.path = ["items", 1, "id"]
updateNodeValue(selectedNode.path, "999");

// ============================================================================
// 6. WHAT HAPPENS AFTER updateNodeValue()
// ============================================================================

/*
updateNodeValue(path, value)
         ↓
Updates JSON string in useJson store
         ↓
Calls useGraph.setGraph(json) automatically
         ↓
Graph parser re-parses JSON to nodes/edges
         ↓
Nodes and edges updated in graph store
         ↓
GraphView component re-renders with new data
         ↓
User sees updated visualization instantly
*/

// ============================================================================
// 7. HANDLING EDGE CASES
// ============================================================================

// Empty path = root update (rare)
updateNodeValue([], '{"new":"object"}');

// Undefined path handling
if (selectedNode?.path) {
  updateNodeValue(selectedNode.path, newValue);
}

// Validation
const { updateNodeValue } = useJson();
const newValue = JSON.stringify({x: 1, y: 2});
updateNodeValue(selectedNode.path, newValue);

// ============================================================================
// 8. KEY POINTS
// ============================================================================

/*
✓ selectedNode.path contains the JSONPath array
✓ JSONPath is like ["user", "name"] or ["items", 0, "id"]
✓ Type conversion happens automatically
✓ Graph re-parses and re-renders automatically
✓ Original JSON is preserved in case of errors
✓ No manual graph update needed - it's automatic
*/
