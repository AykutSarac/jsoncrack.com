import React, { useState } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, Group, Textarea } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import { toast } from "react-hot-toast";
import type { Node } from "jsonc-parser";
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
  const updateNode = useGraph(state => state.updateNode);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const handleEdit = () => {
    setEditedContent(normalizeNodeData(nodeData?.text ?? []));
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const parsedContent = JSON.parse(editedContent);
      if (nodeData) {
        const newNodeData = {
          ...nodeData,
          text: Object.entries(parsedContent).map(([key, value]) => ({
            key,
            value: String(value),
            type: (typeof value === 'object' 
                    ? (Array.isArray(value) ? 'array' : 'object')
                    : value === null ? 'null'
                    : typeof value === 'string' ? 'string'
                    : typeof value === 'number' ? 'number'
                    : typeof value === 'boolean' ? 'boolean'
                    : 'string') as Node['type']
          }))
        };
        await updateNode(newNodeData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Invalid JSON:', error);
      toast.error('Failed to update the node');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
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
            <CloseButton onClick={onClose} />
          </Flex>
          <ScrollArea.Autosize mah={250} maw={600}>
            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(event) => setEditedContent(event.currentTarget.value)}
                minRows={4}
                maxRows={8}
                miw={350}
                maw={600}
                autosize
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
          <Group justify="flex-end">
            {!isEditing ? (
              <Button size="xs" onClick={handleEdit}>
                Edit
              </Button>
            ) : (
              <>
                <Button size="xs" color="red" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="xs" color="green" onClick={handleSave}>
                  Save
                </Button>
              </>
            )}
          </Group>
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
