import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, Textarea, Group } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import { modify, applyEdits, parseTree, findNodeAtLocation, parse as jsoncParse } from "jsonc-parser";
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

  const [editing, setEditing] = React.useState<boolean>(false);
  const [editedText, setEditedText] = React.useState<string>(normalizeNodeData(nodeData?.text ?? []));
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // reset editor content when node changes
    // try to extract exact JSON slice for the selected node so nested children are preserved
    try {
      const originalJson = useFile.getState().contents || useJson.getState().getJson();
      if (nodeData?.path && nodeData.path.length >= 0) {
        const root = parseTree(originalJson);
        if (root) {
          const target = findNodeAtLocation(root, nodeData.path as Array<string | number>);
          if (target && typeof target.offset === "number" && typeof target.length === "number") {
            const slice = originalJson.substring(target.offset, target.offset + target.length);
            setEditedText(slice);
          } else {
            setEditedText(normalizeNodeData(nodeData?.text ?? []));
          }
        } else {
          setEditedText(normalizeNodeData(nodeData?.text ?? []));
        }
      } else {
        setEditedText(normalizeNodeData(nodeData?.text ?? []));
      }
    } catch (e) {
      setEditedText(normalizeNodeData(nodeData?.text ?? []));
    }
    setEditing(false);
    setError(null);
  }, [nodeData?.id]);

  const applyNodeEdit = async (text: string): Promise<void> => {
    if (!nodeData) return;

    const originalJson = useFile.getState().contents || useJson.getState().getJson();

    let newValue: unknown;
    try {
      // use jsonc-parser to allow comments and trailing commas
      newValue = jsoncParse(text);
    } catch (err) {
      setError("Invalid JSON");
      return;
    }

    const path = nodeData.path;
    if (!path) {
      setError("No node selected or node has no path");
      return;
    }

    try {
      const edits = modify(originalJson, path as Array<string | number>, newValue, {
        formattingOptions: { insertSpaces: true, tabSize: 2 },
      });
      const newJson = applyEdits(originalJson, edits);

      // Update left editor contents and graph
      useFile.getState().setContents({ contents: newJson, hasChanges: true, skipUpdate: false });
      // Also update json store immediately so graph refreshes without waiting for debounce
      useJson.getState().setJson(newJson);

      // update selected node to the refreshed node
      setEditing(false);
      setError(null);

      setTimeout(() => {
        const nodes = useGraph.getState().nodes;
        const matched = nodes.find(n => JSON.stringify(n.path) === JSON.stringify(path));
        if (matched) useGraph.getState().setSelectedNode(matched);
      }, 150);
    } catch (err: any) {
      setError(err?.message || String(err));
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
            {!editing ? (
              <CodeHighlight
                code={normalizeNodeData(nodeData?.text ?? [])}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
            ) : (
              <Textarea
                minRows={6}
                maxRows={20}
                value={editedText}
                onChange={e => setEditedText(e.currentTarget.value)}
                styles={{ input: { fontFamily: "monospace" } }}
              />
            )}
            {error && (
              <Text color="red" fz="xs" mt="xs">
                {error}
              </Text>
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

        <Flex justify="flex-end" gap="xs">
          {!editing ? (
            <Button size="xs" onClick={() => setEditing(true)} disabled={!nodeData}>
              Edit
            </Button>
          ) : (
            <>
              <Button
                size="xs"
                color="gray"
                variant="outline"
                onClick={() => {
                  // cancel: reset and stop editing
                  setEditedText(normalizeNodeData(nodeData?.text ?? []));
                  setEditing(false);
                  setError(null);
                }}
              >
                Cancel
              </Button>
              <Button
                size="xs"
                onClick={async () => {
                  await applyNodeEdit(editedText);
                }}
              >
                Save
              </Button>
            </>
          )}
        </Flex>
      </Stack>
    </Modal>
  );
};
