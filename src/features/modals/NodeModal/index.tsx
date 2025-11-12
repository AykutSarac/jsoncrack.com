import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson";
import useFile from "../../../store/useFile";
import useNodeEdit from "../../../store/useNodeEdit";
import { useEffect } from "react";
import updateJsonStyles from "../../../lib/utils/json/updateJsonStyles";
import updateJsonValue from "../../../lib/utils/json/updateJsonValue";
import { useState } from "react";

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
  const { open, editingNodeId, draft, start, updateDraft, reset } = useNodeEdit();
  const json = useJson(state => state.json);
  const setJson = useJson(state => state.setJson);
  const setContents = useFile(state => state.setContents);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!opened) {
      // clear any edit state when the modal closes so inline controls don't linger
      reset();
    }
  }, [opened, reset]);
  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <Flex gap="xs" align="center">
              {!(open && editingNodeId === nodeData?.id) && (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    const node = nodeData;
                    if (!node) return;
                    // derive initial values from node text and _styles
                    const parsed = (() => {
                      try {
                        return JSON.parse(json || "{}");
                      } catch (e) {
                        return null;
                      }
                    })();
                    const styles = parsed?._styles?.[node.id];
                    const initialName = styles?.displayName ?? node.text?.[0]?.value ?? "";
                    const initialColor = styles?.color ?? "#4C6EF5";
                      // start modal-based edit and suppress the inline editor render on the graph
                      start(node.id, { name: String(initialName), color: initialColor }, { suppressInline: true });
                  }}
                  data-testid="node-modal-edit-btn"
                >
                  Edit
                </Button>
              )}
              <CloseButton onClick={onClose} />
            </Flex>
          </Flex>
          <ScrollArea.Autosize mah={250} maw={600}>
            {/* if the edit UI is active for this node, render a small inline editor here */}
            {open && editingNodeId === nodeData?.id ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 350 }} onClick={e => e.stopPropagation()}>
                <input
                  aria-label="Name"
                  value={draft.name}
                  onChange={e => updateDraft({ name: e.currentTarget.value })}
                  placeholder="Name"
                  style={{ padding: 8, fontSize: 13 }}
                />
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="color"
                    value={draft.color}
                    onChange={e => updateDraft({ color: e.currentTarget.value })}
                    aria-label="Color"
                  />
                  <input
                    value={draft.color}
                    onChange={e => updateDraft({ color: e.currentTarget.value })}
                    style={{ padding: 8, fontSize: 13, width: 120 }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <Button size="xs" variant="default" onClick={() => { reset(); }}>
                    Cancel
                  </Button>
                  <Button size="xs" onClick={async () => {
                    setSaving(true);
                    try {
                      if (!nodeData) return;
                      
                      let updatedJson = json;
                      
                      // Determine which field to update based on node structure
                      // Check if this is an object node with a "name" field
                      const nameRow = nodeData.text?.find(row => row.key === "name");
                      const firstRow = nodeData.text?.[0];
                      const isObjectNode = firstRow?.key !== null;
                      
                      if (nameRow && nodeData.path) {
                        // Object node with a "name" field - update the name field
                        updatedJson = updateJsonValue(updatedJson, nodeData.path, draft.name, "name");
                        // Also update the color field if it exists in the object
                        const colorRow = nodeData.text?.find(row => row.key === "color");
                        if (colorRow) {
                          updatedJson = updateJsonValue(updatedJson, nodeData.path, draft.color, "color");
                        }
                      } else if (nodeData.path && nodeData.path.length > 0 && !isObjectNode) {
                        // Text node (leaf value) - update the value directly at the path
                        // Try to preserve the original type if possible
                        let valueToSet: string | number | null = draft.name;
                        if (firstRow?.value !== null && typeof firstRow.value === "number") {
                          // Try to parse as number if original was a number
                          const numValue = Number(draft.name);
                          if (!isNaN(numValue) && draft.name.trim() !== "") {
                            valueToSet = numValue;
                          }
                        } else if (firstRow?.value === null || firstRow?.value === "null") {
                          // Handle null values
                          if (draft.name.toLowerCase() === "null") {
                            valueToSet = null;
                          }
                        }
                        updatedJson = updateJsonValue(updatedJson, nodeData.path, valueToSet);
                      } else if (isObjectNode && nodeData.path) {
                        // Object node but no "name" field - try to update the first field's value
                        // This handles cases where the user wants to edit a different field
                        // For now, if there's no name field, we'll just update styles
                        // (The actual field editing could be enhanced in the future)
                      }
                      
                      // Also update the styles for display purposes (displayName and color)
                      updatedJson = updateJsonStyles(updatedJson, String(nodeData.id), { displayName: draft.name, color: draft.color });
                      
                      // update both the json store (graph pipeline) and the file editor contents so the left editor shows the change
                      setJson(updatedJson);
                      // update the file editor contents using setContents with skipUpdate to prevent triggering graph update
                      // (since we're already updating the graph via setJson above)
                      await setContents({ contents: updatedJson, hasChanges: false, skipUpdate: true });
                      // also persist to session storage (used on page load) so both editors/readers see the change
                      try {
                        sessionStorage.setItem("content", updatedJson);
                        sessionStorage.setItem("format", "JSON");
                      } catch (e) {
                        // session storage may not be available in some contexts; swallow
                      }
                      reset();
                    } finally {
                      setSaving(false);
                    }
                  }} loading={saving}>
                    Save
                  </Button>
                </div>
              </div>
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

// ensure edit state is cleared whenever the modal closes to avoid leftover inline controls
// (we purposely don't clear when modal opens so the edit can be started)
export default NodeModal;
