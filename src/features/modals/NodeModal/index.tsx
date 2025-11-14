import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, Group, TextInput } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import { MdEdit } from "react-icons/md";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson";

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
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState(-1);
  const [editValue, setEditValue] = React.useState("");

  const json = useJson(state => state.json);
  const setJson = useJson(state => state.setJson);

  React.useEffect(() => {
    if (editingIndex >= 0 && nodeData?.text?.[editingIndex]?.value !== undefined) {
      setEditValue(String(nodeData.text[editingIndex].value));
    }
  }, [nodeData, editingIndex]);

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!nodeData?.path || editingIndex < 0) return;

    try {
      const jsonObj = JSON.parse(json);
      let current = jsonObj;

      // Navigate to the parent object/array
      for (let i = 0; i < nodeData.path.length - 1; i++) {
        current = current[nodeData.path[i]];
      }

      // Update the value
      const lastKey = nodeData.path[nodeData.path.length - 1];
      
      // Try to parse as number, boolean, or null first
      let newValue: any = editValue;
      if (editValue === "null") {
        newValue = null;
      } else if (editValue === "true") {
        newValue = true;
      } else if (editValue === "false") {
        newValue = false;
      } else if (!isNaN(Number(editValue)) && editValue !== "") {
        newValue = Number(editValue);
      }

      current[lastKey] = newValue;
      setJson(JSON.stringify(jsonObj));
      setIsEditing(false);
      setEditingIndex(-1);
    } catch (error) {
      console.error("Failed to update value:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingIndex(-1);
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
          {!isEditing ? (
            <>
              <ScrollArea.Autosize mah={250} maw={600}>
                <CodeHighlight
                  code={normalizeNodeData(nodeData?.text ?? [])}
                  miw={350}
                  maw={600}
                  language="json"
                  withCopyButton
                />
              </ScrollArea.Autosize>
              {nodeData?.text && nodeData.text.length > 0 && (
                <Stack gap="xs">
                  {nodeData.text.map((row, index) => {
                    if (row.type === "array" || row.type === "object") return null;
                    return (
                      <Button
                        key={index}
                        leftSection={<MdEdit />}
                        variant="light"
                        size="xs"
                        onClick={() => handleEditClick(index)}
                        fullWidth
                      >
                        Edit {row.key ? `${row.key}` : "Value"}
                      </Button>
                    );
                  })}
                </Stack>
              )}
            </>
          ) : (
            <>
              <TextInput
                label="New Value"
                placeholder="Enter new value"
                value={editValue}
                onChange={e => setEditValue(e.currentTarget.value)}
                autoFocus
              />
              <Group grow>
                <Button size="xs" onClick={handleSave}>
                  Save
                </Button>
                <Button size="xs" variant="default" onClick={handleCancel}>
                  Cancel
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
