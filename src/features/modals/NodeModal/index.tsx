import React, { useState, useEffect } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import { toast } from "react-hot-toast";
import useFile from "../../../store/useFile";
import useJson from "../../../store/useJson";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";

// return object from json removing array and object fields
const normalizeNodeData = (nodeRows: NodeData["text"]) => {
  if (!nodeRows || nodeRows.length === 0) return "{}";
  if (nodeRows.length === 1 && !nodeRows[0].key) {
    return JSON.stringify(nodeRows[0].value, null, 2);
  }

  const obj: Record<string, unknown> = {};
  nodeRows?.forEach(row => {
    if (row.type !== "array" && row.type !== "object") {
      if (row.key) obj[row.key] = row.value;
    }
  });
  return JSON.stringify(obj, null, 2);
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const pathsEqual = (a?: NodeData["path"], b?: NodeData["path"]) => {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  return a.every((segment, index) => segment === b[index]);
};

const refreshSelectedNode = (path?: NodeData["path"]) => {
  if (!path) return;
  const graphState = useGraph.getState();
  const updatedNode = graphState.nodes.find(node => pathsEqual(node.path, path));
  if (updatedNode) {
    graphState.setSelectedNode(updatedNode);
  }
};

const applyNodePatch = (data: unknown, path: NodeData["path"], patch: unknown): unknown => {
  if (!path) {
    throw new Error("Unable to resolve the selected node path.");
  }

  if (path.length === 0) {
    if (isPlainObject(data) && isPlainObject(patch)) {
      return { ...data, ...patch };
    }
    return patch;
  }

  let parent: any = data;
  for (let i = 0; i < path.length - 1; i += 1) {
    const segment = path[i];
    if (parent == null || typeof parent !== "object") {
      throw new Error("Unable to resolve the selected node path.");
    }
    parent = parent[segment as keyof typeof parent];
  }

  const lastSegment = path[path.length - 1];
  if (lastSegment === undefined) {
    return patch;
  }

  const currentValue = parent?.[lastSegment as keyof typeof parent];
  if (isPlainObject(currentValue) && isPlainObject(patch)) {
    parent[lastSegment as keyof typeof parent] = {
      ...currentValue,
      ...patch,
    };
  } else {
    parent[lastSegment as keyof typeof parent] = patch;
  }

  return data;
};

// return json path in the format $["customer"]
const jsonPathToString = (path?: NodeData["path"]) => {
  if (!path || path.length === 0) return "$";
  const segments = path.map(seg => (typeof seg === "number" ? seg : `"${seg}"`));
  return `$[${segments.join("][")}]`;
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);
  const getJson = useJson(state => state.getJson);
  const setJson = useJson(state => state.setJson);
  const setContents = useFile(state => state.setContents);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(normalizeNodeData(nodeData?.text ?? []));
  const [originalContent, setOriginalContent] = useState(editedContent); // Store original content

  useEffect(() => {
    setEditedContent(normalizeNodeData(nodeData?.text ?? [])); // Reset edited content when nodeData changes
    setOriginalContent(normalizeNodeData(nodeData?.text ?? [])); // Update original content
    setEditing(false); // Ensure editing is false when node changes
  }, [nodeData]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    if (!nodeData) return;
    if (!nodeData.path) {
      toast.error("This node cannot be edited.");
      return;
    }

    try {
      const parsedPatch = JSON.parse(editedContent);
      const normalizedPatch = JSON.stringify(parsedPatch, null, 2);
      const currentJson = getJson();
      const parsedJson = JSON.parse(currentJson);
      const updatedJson = applyNodePatch(parsedJson, nodeData.path, parsedPatch);
      const serializedJson = JSON.stringify(updatedJson, null, 2);

      setJson(serializedJson);
      await setContents({
        contents: serializedJson,
        hasChanges: true,
        propagateGraph: false,
      });

      setEditedContent(normalizedPatch);
      setOriginalContent(normalizedPatch);
      refreshSelectedNode(nodeData.path);
      setEditing(false);
      toast.success("Node updated");
    } catch (error) {
      console.error(error);
      toast.error("Unable to save changes. Please ensure the JSON is valid.");
    }
  };

  const handleCancel = () => {
    setEditedContent(originalContent); // Revert to original content
    setEditing(false);
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
            {editing ? (
              <textarea
                value={editedContent}
                onChange={e => setEditedContent(e.target.value)}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  padding: "5px",
                  fontSize: "1rem",
                }}
              />
            ) : (
              <CodeHighlight
                code={editedContent}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
            )}
            <Flex justify="flex-end" align="flex-end" style={{ marginTop: "10px" }}>
              {!editing ? (
                <button
                  onClick={handleEdit}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "5px",
                    backgroundColor: "#36393e",
                    color: "#fff",
                    fontSize: "1rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "5px",
                      backgroundColor: "#36393e",
                      color: "#fff",
                      fontSize: "1rem",
                      border: "none",
                      cursor: "pointer",
                      marginRight: "5px",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "5px",
                      backgroundColor: "#36393e",
                      color: "#fff",
                      fontSize: "1rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </Flex>
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
