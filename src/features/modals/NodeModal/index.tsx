import React, { useEffect, useState } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, Textarea, Group } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useFile from "../../../store/useFile";
import useJson from "../../../store/useJson";
import { setValueAtPath, getValueAtPath } from "../../../lib/utils/jsonPath";

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
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const getJson = useJson(state => state.getJson);
  const setJson = useJson(state => state.setJson);
  const setSelectedNode = useGraph(state => state.setSelectedNode);
  const setContents = useFile(state => state.setContents);

  useEffect(() => {
    setError(null);
    setEditing(false);
    try {
      const json = getJson();
      const val = getValueAtPath(json, nodeData?.path);
      if (typeof val === "undefined") {
        setEditValue(normalizeNodeData(nodeData?.text ?? []));
      } else if (typeof val === "string") {
        setEditValue(JSON.stringify(val));
      } else {
        setEditValue(JSON.stringify(val, null, 2));
      }
    } catch (e) {
      setEditValue(normalizeNodeData(nodeData?.text ?? []));
    }
  }, [nodeData]);

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
            {!editing ? (
              <CodeHighlight
                code={(() => {
                  try {
                    const json = getJson();
                    const val = getValueAtPath(json, nodeData?.path);
                    if (typeof val === "undefined") return normalizeNodeData(nodeData?.text ?? []);
                    if (typeof val === "string") return JSON.stringify(val);
                    return JSON.stringify(val, null, 2);
                  } catch (e) {
                    return normalizeNodeData(nodeData?.text ?? []);
                  }
                })()}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
            ) : (
              <Textarea
                autosize
                minRows={4}
                maxRows={20}
                value={editValue}
                onChange={e => setEditValue(e.currentTarget.value)}
                styles={{ input: { fontFamily: "monospace" } }}
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

        <Group position="right" spacing="xs">
          {!editing ? (
            <Button size="xs" variant="outline" onClick={() => setEditing(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button
                size="xs"
                onClick={() => {
                  // Save edited value with strict validation for arrays/objects
                  try {
                    setError(null);

                    const oldJson = getJson();
                    const originalVal = (() => {
                      try {
                        return getValueAtPath(oldJson, nodeData?.path);
                      } catch (e) {
                        return undefined;
                      }
                    })();

                    // If original value is an object/array, require valid JSON and matching type
                    if (originalVal !== undefined && typeof originalVal === "object") {
                      let parsed: any;
                      try {
                        parsed = JSON.parse(editValue);
                      } catch (e) {
                        setError("Invalid JSON — please enter valid JSON for arrays/objects.");
                        return;
                      }

                      const wasArray = Array.isArray(originalVal);
                      const isArrayNow = Array.isArray(parsed);
                      if (wasArray !== isArrayNow) {
                        setError(wasArray ? "Expected an array JSON (e.g. [1, 2, 3])" : "Expected an object JSON (e.g. {\"key\": \"value\"})");
                        return;
                      }

                      const newJson = setValueAtPath(oldJson, nodeData?.path, parsed);
                                            try {
                                              // also update left editor contents so the editor pane reflects the change
                                              setContents({ contents: newJson, hasChanges: true });
                                            } catch (e) {}
                      setJson(newJson);
                      // update selected node to the new parsed node so modal reflects changes
                      try {
                        const updatedNode = useGraph.getState().nodes.find(n =>
                          JSON.stringify(n.path) === JSON.stringify(nodeData?.path)
                        );
                        if (updatedNode && setSelectedNode) setSelectedNode(updatedNode as any);
                      } catch (e) {}
                      setEditing(false);
                      return;
                    }

                    // For scalars: try parse, fallback to saving as string
                    let parsedScalar: any;
                    try {
                      parsedScalar = JSON.parse(editValue);
                    } catch (e) {
                      parsedScalar = editValue;
                    }

                    const newJson = setValueAtPath(oldJson, nodeData?.path, parsedScalar);
                                          try {
                                            setContents({ contents: newJson, hasChanges: true });
                                          } catch (e) {}
                    setJson(newJson);
                    try {
                      const updatedNode = useGraph.getState().nodes.find(n =>
                        JSON.stringify(n.path) === JSON.stringify(nodeData?.path)
                      );
                      if (updatedNode && setSelectedNode) setSelectedNode(updatedNode as any);
                    } catch (e) {}
                    setEditing(false);
                  } catch (e: any) {
                    setError(e?.message ?? "Failed to save");
                  }
                }}
              >
                Save
              </Button>
              <Button
                size="xs"
                variant="subtle"
                onClick={() => {
                  setEditing(false);
                  setEditValue(normalizeNodeData(nodeData?.text ?? []));
                  setError(null);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Group>
        {error ? (
          <Text fz="xs" color="red">
            {error}
          </Text>
        ) : null}
      </Stack>
    </Modal>
  );
};
