/**
 * GUIDE: Updating JSON State When Node Values Change
 * 
 * This document explains how to update nested JSON values in the JSON Crack application.
 */

// ============================================================================
// 1. CORE UTILITY FUNCTIONS
// ============================================================================

/**
 * Location: src/lib/utils/updateJsonByPath.ts
 * 
 * Key exports:
 * - updateJsonByPath(json, path, newValue) - Main update function
 * - parseValueInput(input) - Intelligent type parsing
 * - setNestedValue(obj, path, value) - Low-level path setter
 * - getJsonValueByPath(json, path) - Read values by path
 * - isValidJson(json) - Validate JSON strings
 */

// ============================================================================
// 2. STORE INTEGRATION
// ============================================================================

/**
 * Location: src/store/useJson.ts
 * 
 * New action added:
 * updateNodeValue(path: JSONPath | undefined, newValue: string) => void
 * 
 * This action:
 * 1. Updates the JSON in the store
 * 2. Automatically re-parses the graph visualization
 * 3. Re-renders all nodes with new data
 */

// ============================================================================
// 3. USAGE EXAMPLES
// ============================================================================

// Example 1: Simple value update
// --------------------------------
import useJson from "../store/useJson";

const updateUserName = () => {
  const { updateNodeValue } = useJson();
  const path = ["user", "name"]; // JSONPath
  updateNodeValue(path, "John Doe");
};

// Original JSON: { "user": { "name": "Jane" } }
// Updated JSON:  { "user": { "name": "John Doe" } }

// Example 2: Update array element
// --------------------------------
const updateArrayElement = () => {
  const { updateNodeValue } = useJson();
  const path = ["items", 0, "quantity"]; // First item's quantity
  updateNodeValue(path, "42");
};

// Original JSON: { "items": [{ "quantity": 10 }] }
// Updated JSON:  { "items": [{ "quantity": 42 }] }

// Example 3: Complex type parsing
// --------------------------------
const updateToObject = () => {
  const { updateNodeValue } = useJson();
  // User input: '{"x":1,"y":2}'
  // Automatically parsed as object
  updateNodeValue(["location"], '{"x":1,"y":2}');
};

// Original JSON: { "location": "unknown" }
// Updated JSON:  { "location": { "x": 1, "y": 2 } }

// Example 4: In a React component (Modal)
// ----------------------------------------
import React from "react";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";

const NodeEditForm = () => {
  const selectedNode = useGraph(state => state.selectedNode);
  const { updateNodeValue } = useJson();
  const [value, setValue] = React.useState("");

  const handleSave = () => {
    if (selectedNode) {
      // selectedNode.path is the JSONPath array
      // e.g., ["user", "profile", "email"]
      updateNodeValue(selectedNode.path, value);
    }
  };

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

// ============================================================================
// 4. TYPE PARSING RULES
// ============================================================================

/**
 * parseValueInput() automatically converts strings to appropriate types:
 * 
 * Input              → Output Type
 * ────────────────────────────────
 * "true"             → boolean (true)
 * "false"            → boolean (false)
 * "null"             → null
 * "123"              → number (123)
 * "-45.67"           → number (-45.67)
 * "[1,2,3]"          → array [1, 2, 3]
 * '{"a":1}'          → object {a: 1}
 * "hello"            → string ("hello")
 * "2024-01-01"       → string (keep as-is)
 */

// ============================================================================
// 5. UNDERSTANDING JSONPATH
// ============================================================================

/**
 * JSONPath structure (from jsonc-parser library):
 * type JSONPath = (string | number)[]
 * 
 * Examples for JSON: { "user": { "profile": { "email": "test@example.com" } } }
 * 
 * Path                          → Value
 * ──────────────────────────────────────────────
 * []                            → entire object
 * ["user"]                      → { "profile": {...} }
 * ["user", "profile"]           → { "email": "..." }
 * ["user", "profile", "email"]  → "test@example.com"
 * 
 * Examples for arrays: { "items": [{ "id": 1 }, { "id": 2 }] }
 * 
 * Path              → Value
 * ─────────────────────────────
 * ["items"]         → [...array]
 * ["items", 0]      → { "id": 1 }
 * ["items", 0, "id"] → 1
 * ["items", 1]      → { "id": 2 }
 */

// ============================================================================
// 6. COMPLETE WORKFLOW EXAMPLE
// ============================================================================

/**
 * Full integration example with edit modal
 */

import type { ModalProps } from "@mantine/core";
import { Modal, TextInput, Button, Group } from "@mantine/core";

export const CompleteEditExample = ({ opened, onClose }: ModalProps) => {
  const selectedNode = useGraph(state => state.selectedNode);
  const { updateNodeValue } = useJson();
  const [tempValue, setTempValue] = React.useState("");
  const [originalValue, setOriginalValue] = React.useState("");

  // 1. INITIALIZE: When modal opens, store current value
  React.useEffect(() => {
    if (selectedNode && opened) {
      const currentValue = JSON.stringify(selectedNode.text[0].value);
      setOriginalValue(currentValue);
      setTempValue(currentValue);
    }
  }, [selectedNode, opened]);

  // 2. SAVE: User clicks save button
  const handleSave = () => {
    if (selectedNode && tempValue !== originalValue) {
      // Call the store action with path and new value
      updateNodeValue(selectedNode.path, tempValue);
      // This will:
      // - Update JSON in useJson store
      // - Re-parse graph via jsonParser
      // - Update nodes/edges in useGraph store
      // - Re-render GraphView with new data
      onClose();
    }
  };

  // 3. CANCEL: User clicks cancel button
  const handleCancel = () => {
    // Simply close without updating
    setTempValue(originalValue);
    onClose();
  };

  if (!selectedNode) return null;

  return (
    <Modal opened={opened} onClose={handleCancel} centered>
      <div>
        <TextInput
          label="Edit Value"
          value={tempValue}
          onChange={(e) => setTempValue(e.currentTarget.value)}
          placeholder="Enter new value"
        />
        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={tempValue === originalValue}>
            Save
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

// ============================================================================
// 7. ERROR HANDLING
// ============================================================================

/**
 * The updateJsonByPath function includes error handling:
 * 
 * - Invalid JSON syntax returns original JSON
 * - Invalid paths are silently ignored (no error thrown)
 * - Type parsing failures default to string
 * 
 * For production, you might want to:
 * 1. Add validation before calling updateNodeValue
 * 2. Show user-friendly error messages
 * 3. Log errors for debugging
 */

import { isValidJson } from "../lib/utils/updateJsonByPath";

const safeUpdate = (path, value) => {
  const { updateNodeValue, json } = useJson();
  
  // Validate before update
  if (!isValidJson(json)) {
    console.error("Current JSON is invalid");
    return;
  }

  try {
    updateNodeValue(path, value);
  } catch (error) {
    console.error("Failed to update node:", error);
    // Show toast/notification to user
  }
};

// ============================================================================
// 8. ADVANCED PATTERNS
// ============================================================================

/**
 * Pattern 1: Undo/Redo Support
 * Store original value before update, allow reverting
 */
const withUndo = (path, newValue) => {
  const { json, updateNodeValue } = useJson();
  const originalJson = json; // Save for undo
  
  updateNodeValue(path, newValue);
  
  // Later: undo by restoring
  // useJson.setState({ json: originalJson });
};

/**
 * Pattern 2: Batch Updates
 * Update multiple values and re-parse once
 */
const batchUpdate = (updates: Array<[JSONPath | undefined, string]>) => {
  let { json } = useJson.getState();
  const { updateJsonByPath } = require("../lib/utils/updateJsonByPath");
  
  // Apply all updates to JSON
  for (const [path, value] of updates) {
    json = updateJsonByPath(json, path, value);
  }
  
  // Update store once (triggers graph re-parse once)
  useJson.setState({ json });
  useGraph.getState().setGraph(json);
};

/**
 * Pattern 3: Validation Before Save
 * Ensure data conforms to schema
 */
const validateAndUpdate = (path, value, validator) => {
  try {
    const parsed = parseValueInput(value);
    
    if (!validator(parsed)) {
      throw new Error("Validation failed");
    }
    
    updateNodeValue(path, value);
  } catch (error) {
    console.error("Validation error:", error);
  }
};

// ============================================================================
// 9. TESTING EXAMPLES
// ============================================================================

/**
 * Unit test examples for updateJsonByPath
 */

import { updateJsonByPath, parseValueInput, setNestedValue } from "../lib/utils/updateJsonByPath";

// Test 1: Simple property update
const json1 = '{"name":"John"}';
const result1 = updateJsonByPath(json1, ["name"], "Jane");
console.assert(result1 === '{"name":"Jane"}', "Simple update failed");

// Test 2: Nested property update
const json2 = '{"user":{"name":"John"}}';
const result2 = updateJsonByPath(json2, ["user", "name"], "Jane");
console.assert(JSON.parse(result2).user.name === "Jane", "Nested update failed");

// Test 3: Array element update
const json3 = '{"items":[{"id":1}]}';
const result3 = updateJsonByPath(json3, ["items", 0, "id"], "999");
console.assert(JSON.parse(result3).items[0].id === 999, "Array update failed");

// Test 4: Type conversion
console.assert(parseValueInput("123") === 123, "Number parse failed");
console.assert(parseValueInput("true") === true, "Boolean parse failed");
console.assert(parseValueInput("null") === null, "Null parse failed");
console.assert(parseValueInput("hello") === "hello", "String parse failed");
