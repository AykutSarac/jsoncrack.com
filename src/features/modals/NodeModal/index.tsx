import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, Textarea } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson";
import useFile from "../../../store/useFile";

// return object from json removing array and object fields
const normalizeNodeData = (nodeRows: NodeData["text"]) => {
  if (!nodeRows || nodeRows.length === 0) return "{}";
  if (nodeRows.length === 1 && !nodeRows[0].key) return `${nodeRows[0].value}`;

  const obj: Record<string, any> = {};
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
  const getJson = useJson.getState().getJson;
  const setJson = useJson.getState().setJson;

  const [isEditing, setIsEditing] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // reset editing state whenever node changes or modal opened/closed
    setIsEditing(false);
    setError(null);
    setEditedContent("");
  }, [nodeData, opened]);

  const enterEditMode = () => {
    setError(null);
    try {
      const raw = getJson();
      const parsed = JSON.parse(raw);

      const getValueAtPath = (obj: any, path: NodeData["path"] | undefined) => {
        if (!path || path.length === 0) return obj;
        let curr = obj;
        for (let i = 0; i < path.length; i++) {
          const seg = path[i] as string | number;
          if (curr === undefined || curr === null) return undefined;
          curr = curr[seg];
        }
        return curr;
      };

      const value = getValueAtPath(parsed, nodeData?.path);
      setEditedContent(JSON.stringify(value, null, 2));
    } catch (err) {
      // fallback to previous behavior
      setEditedContent(normalizeNodeData(nodeData?.text ?? []));
    }
    setIsEditing(true);
  };

  // helper to set value at path inside an object (mutates obj)
  const setValueAtPath = (obj: any, path: NodeData["path"] | undefined, value: any) => {
    if (!path || path.length === 0) {
      return value;
    }

    let curr: any = obj;
    for (let i = 0; i < path.length - 1; i++) {
      const seg = path[i] as string | number;
      if (typeof seg === "number") {
        if (!Array.isArray(curr[seg])) curr[seg] = [];
      } else {
        if (curr[seg] === undefined) curr[seg] = {};
      }
      curr = curr[seg];
    }

    const last = path[path.length - 1] as string | number;
    curr[last] = value;
    return obj;
  };

  const handleSave = () => {
    setError(null);
    try {
      const newValue = JSON.parse(editedContent);

  // get current app JSON
  const raw = getJson();
  const parsed = JSON.parse(raw);

  const updated = setValueAtPath(parsed, nodeData?.path, newValue);

  // Update the editor/file contents so Export and other file-level state reflect the change
  useFile.getState().setContents({ contents: JSON.stringify(updated, null, 2), hasChanges: true });

  // debouncedUpdateJson inside useFile will update useJson / graph; close modal
  setIsEditing(false);
  onClose?.();
    } catch (err: any) {
      setError(err?.message ?? String(err));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setEditedContent("");
  };

  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <Flex gap="xs" align="center">
              {!isEditing ? (
                <Button size="xs" variant="outline" onClick={enterEditMode}>
                  Edit
                </Button>
              ) : (
                <>
                  <Button size="xs" color="blue" onClick={handleSave}>
                    Save
                  </Button>
                  <Button size="xs" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              )}
              <CloseButton onClick={onClose} />
            </Flex>
          </Flex>
          <ScrollArea.Autosize mah={250} maw={600}>
            {!isEditing ? (
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
                value={editedContent}
                onChange={e => setEditedContent(e.currentTarget.value)}
                styles={{ input: { fontFamily: "monospace" } }}
              />
            )}
            {error && (
              <Text fz="xs" color="red" mt="xs">
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
      </Stack>
    </Modal>
  );
};
