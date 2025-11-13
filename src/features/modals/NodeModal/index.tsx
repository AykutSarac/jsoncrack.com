import React, { useState } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, Textarea, Group } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";

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
  const updateNodeValue = useGraph(state => state.updateNodeValue);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [displayContent, setDisplayContent] = useState("");

  React.useEffect(() => {
    if (nodeData) {
      const normalized = normalizeNodeData(nodeData.text ?? []);
      setEditValue(normalized);
      setDisplayContent(normalized);
      setIsEditing(false);
    }
  }, [nodeData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (nodeData?.id) {
      updateNodeValue(nodeData.id, editValue);
      // Refresh display content after save
      setDisplayContent(editValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (nodeData) {
      const normalized = normalizeNodeData(nodeData.text ?? []);
      setEditValue(normalized);
      setDisplayContent(normalized);
    }
    setIsEditing(false);
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
          {isEditing ? (
            <Stack gap="xs">
              <Textarea
                value={editValue}
                onChange={e => setEditValue(e.currentTarget.value)}
                placeholder="Enter new value..."
                minRows={4}
                maxRows={8}
                style={{ fontFamily: "monospace", fontSize: "12px" }}
              />
              <Group justify="flex-end">
                <Button variant="default" size="xs" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button color="blue" size="xs" onClick={handleSave}>
                  Save
                </Button>
              </Group>
            </Stack>
          ) : (
            <>
              <ScrollArea.Autosize mah={250} maw={600}>
                <CodeHighlight
                  code={displayContent}
                  miw={350}
                  maw={600}
                  language="json"
                  withCopyButton
                />
              </ScrollArea.Autosize>
              <Group justify="flex-end">
                <Button variant="light" size="xs" onClick={handleEdit}>
                  Edit
                </Button>
              </Group>
            </>
          )}
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
