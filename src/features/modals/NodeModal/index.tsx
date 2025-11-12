import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Textarea, Button, Group } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson";
import useFile from "../../../store/useFile";
import { toast } from "react-hot-toast";

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

  const [editing, setEditing] = React.useState(false);
  const [editedText, setEditedText] = React.useState<string>("{}");

  React.useEffect(() => {
    // reset when node changes or modal opens
    setEditing(false);
    setEditedText(normalizeNodeData(nodeData?.text ?? []));
  }, [nodeData, opened]);

  const parseEdited = (text: string) => {
    try {
      return JSON.parse(text);
    } catch (err) {
      // if parse fails, treat as string (trim surrounding whitespace)
      return text;
    }
  };

  const setValueAtPath = (root: any, path: NodeData["path"] | undefined, value: any) => {
    if (!path || path.length === 0) return value;

    let cur: any = root;
    for (let i = 0; i < path.length; i++) {
      const seg = path[i];
      const isLast = i === path.length - 1;
      if (isLast) {
        cur[seg as any] = value;
        return root;
      }

      const nextSeg = path[i + 1];
      if (typeof nextSeg === "number") {
        if (!Array.isArray(cur[seg as any])) cur[seg as any] = [];
      } else {
        if (cur[seg as any] == null || typeof cur[seg as any] !== "object") cur[seg as any] = {};
      }
      cur = cur[seg as any];
    }

    return root;
  };

  const handleSave = () => {
    if (!nodeData) return;

    try {
      const parsedValue = parseEdited(editedText);

      const currentJson = JSON.parse(useJson.getState().json || "{}");
      const updated = setValueAtPath(currentJson, nodeData.path, parsedValue);

      const newJsonStr = JSON.stringify(updated, null, 2);

      // update left-side contents (this will also update useJson via debounced update)
      useFile.getState().setContents({ contents: newJsonStr, hasChanges: true });

      // also set json immediately so graph updates instantly
      useJson.getState().setJson(newJsonStr);

      setEditing(false);
      toast.success("Node saved");
      // Close modal to reflect updated graph; keep open if desired
      onClose();
    } catch (error: any) {
      toast.error("Failed to save node: invalid JSON");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedText(normalizeNodeData(nodeData?.text ?? []));
    toast("Edits discarded");
  };

  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <Group spacing="xs">
              {!editing && (
                <Button size="xs" variant="outline" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              )}
              {editing && (
                <>
                  <Button size="xs" onClick={handleSave}>
                    Save
                  </Button>
                  <Button size="xs" variant="subtle" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              )}
              <CloseButton onClick={onClose} />
            </Group>
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
                value={editedText}
                onChange={e => setEditedText(e.currentTarget.value)}
                autosize
                sx={{ fontFamily: "monospace" }}
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
