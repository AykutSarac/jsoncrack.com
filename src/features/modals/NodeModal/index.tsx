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
                      const next = updateJsonStyles(json, String(nodeData?.id ?? ""), { displayName: draft.name, color: draft.color });
                      // update both the json store (graph pipeline) and the file editor contents so the left editor shows the change
                      setJson(next);
                      // directly update useFile state using setState so Monaco re-renders with new content
                      useFile.setState({ contents: next, hasChanges: false });
                      // also persist to session storage (used on page load) so both editors/readers see the change
                      try {
                        sessionStorage.setItem("content", next);
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
