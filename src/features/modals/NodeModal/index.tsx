import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson";
import useFile from "../../../store/useFile";

// return object from json removing array and object fields
const normalizeNodeData = (nodeRows: NodeData["text"]) => {
  if (!nodeRows || nodeRows.length === 0) return "{}";
  if (nodeRows.length === 1 && !nodeRows[0].key) return `${nodeRows[0].value}`;

  const obj = {};
  nodeRows?.forEach(row => {
    if (row.type !== "array" && row.type !== "object") {
      if (row.key) obj[row.key] = row.value;
    }
  });
  return JSON.stringify(obj, null, 2);
};

// return json path in the format $["customer"]
const jsonPathToString = (path?: NodeData["path"]) => {
  if (!path || path.length === 0) return "$";
  const segments = path.map(seg => (typeof seg === "number" ? seg : `"${seg}"`));
  return `$[${segments.join("][")}]`;
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);
  const json = useJson(state => state.json);
  const setJson = useJson(state => state.setJson);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(() => normalizeNodeData(nodeData?.text ?? []));
  const setContents = useFile(state => state.setContents);

  React.useEffect(() => {
    setEditValue(normalizeNodeData(nodeData?.text ?? []));
    setIsEditing(false);
  }, [nodeData, opened]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditValue(normalizeNodeData(nodeData?.text ?? []));
    setIsEditing(false);
  };
  const handleSave = () => {
    try {
      // Parse the edited value
      const edited = JSON.parse(editValue);
      // Find the path to the node
      const path = nodeData?.path;
      if (!path) throw new Error("No path for node");
      // Parse the current JSON
      const jsonObj = JSON.parse(json);

      // Helper to merge fields into existing object at path
      function mergeValueAtPath(obj, pathArr, value) {
        if (pathArr.length === 1) {
          // Only merge if target is an object and value is an object
          if (typeof obj[pathArr[0]] === 'object' && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(obj[pathArr[0]], value);
          } else {
            obj[pathArr[0]] = value;
          }
        } else {
          let key = pathArr[0];
          if (typeof key === 'string' && key.startsWith('"') && key.endsWith('"')) {
            key = key.slice(1, -1);
          }
          mergeValueAtPath(obj[key], pathArr.slice(1), value);
        }
      }

      mergeValueAtPath(jsonObj, [...path], edited);
  const updatedJson = JSON.stringify(jsonObj, null, 2);
  setJson(updatedJson);
  setContents({ contents: updatedJson, hasChanges: true, skipUpdate: false });
  setIsEditing(false);
    } catch (e) {
      alert("Invalid JSON or failed to update: " + e.message);
    }
  };

  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <CloseButton onClick={onClose} />
          </Flex>
          <ScrollArea.Autosize mah={250} maw={600}>
            {isEditing ? (
              <textarea
                style={{ width: '100%', minHeight: 120, fontFamily: 'monospace', fontSize: 14, background: '#23272A', color: '#fff', borderRadius: 6, border: '1px solid #444', padding: 12 }}
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                autoFocus
              />
            ) : (
              <CodeHighlight
                code={normalizeNodeData(nodeData?.text ?? [])}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
            )}
          </ScrollArea.Autosize>
          <Flex justify="end" gap={8} mt={4}>
            {isEditing ? (
              <>
                <button
                  style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  style={{ background: '#6b7280', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginLeft: 8 }}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                style={{ background: '#1e293b', color: '#38bdf8', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
          </Flex>
        </Stack>
        <Text fz="xs" fw={500}>
          JSON Path
        </Text>
        <ScrollArea.Autosize maw={600}>
          <CodeHighlight
            code={jsonPathToString(nodeData?.path)}
            miw={350}
            mah={250}
            language="json"
            copyLabel="Copy to clipboard"
            copiedLabel="Copied to clipboard"
            withCopyButton
          />
        </ScrollArea.Autosize>
      </Stack>
    </Modal>
  );
};
