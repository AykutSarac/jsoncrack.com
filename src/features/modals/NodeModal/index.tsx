import React, { useState } from "react";
import type { ModalProps } from "@mantine/core";
import {
  Modal,
  Stack,
  Text,
  ScrollArea,
  Flex,
  CloseButton,
  TextInput,
  Button,
} from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";

const normalizeNodeData = (nodeRows: NodeData["text"]) => {
  if (!nodeRows || nodeRows.length === 0) return "{}";
  if (nodeRows.length === 1 && !nodeRows[0].key) return `${nodeRows[0].value}`;

  const obj: Record<string, unknown> = {};
  nodeRows?.forEach(row => {
    if (row.type !== "array" && row.type !== "object") {
      if (row.key) obj[row.key] = row.value;
    }
  });
  return JSON.stringify(obj, null, 2);
};

const jsonPathToString = (path?: NodeData["path"]) => {
  if (!path || path.length === 0) return "$";
  const segments = path.map(seg => (typeof seg === "number" ? seg : `"${seg}"`));
  return `$[${segments.join("][")}]`;
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const { selectedNode, updateNode } = useGraph();
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState<Record<string, string>>({});

  if (!selectedNode) return null;

  const handleEditToggle = () => {
    if (!isEditing) {
      // Prefill input values for all editable fields
      const fields: Record<string, string> = {};
      selectedNode.text.forEach(row => {
        if (row.key && row.type !== "array" && row.type !== "object") {
          fields[row.key] = row.value ?? "";
        }
      });
      setEditedFields(fields);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (key: string, value: string) => {
    setEditedFields(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (selectedNode) {
      const updatedText = selectedNode.text.map(row =>
        row.key && editedFields[row.key] !== undefined
          ? { ...row, value: editedFields[row.key] }
          : row
      );

      updateNode(selectedNode.id, {
        ...selectedNode,
        text: updatedText,
      });
    }
    setIsEditing(false);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={`Node: ${selectedNode.id}`}>
      <Stack>
        <Text>Path: {jsonPathToString(selectedNode.path)}</Text>
        <ScrollArea>
          {isEditing ? (
            <Stack>
              {Object.entries(editedFields).map(([key, value]) => (
                <TextInput
                  key={key}
                  label={key}
                  value={value}
                  onChange={e => handleChange(key, e.target.value)}
                />
              ))}
            </Stack>
          ) : (
            <CodeHighlight
              language="json"
              code={normalizeNodeData(selectedNode.text)}
            />
          )}
        </ScrollArea>

        <Flex justify="space-between" mt="sm">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={handleEditToggle}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleEditToggle}>Edit</Button>
          )}
        </Flex>
      </Stack>
    </Modal>
  );
};
