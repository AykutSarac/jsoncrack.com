import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, TextInput, Group } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData, NodeRow } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import { useEditNode } from "../../../store/useEditNode";
import useJson from "../../../store/useJson";
import useFile from "../../../store/useFile";
import { updateJsonByPath } from "../../../lib/utils/jsonPathUpdater";

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
  const { isEditing, editedData, startEditing, updateEditedData, cancelEditing, resetEditState } = useEditNode();
  const setJson = useJson(state => state.setJson);
  const getJson = useJson(state => state.getJson);
  const setContents = useFile(state => state.setContents);

  const handleEdit = () => {
    if (nodeData) {
      startEditing(nodeData.id, nodeData.text);
    }
  };

  const handleSave = () => {
    if (!nodeData || !editedData) return;

    try {
      // Parse the current JSON
      const currentJson = JSON.parse(getJson());
      
      // Update the JSON at the specific path
      const updatedJson = updateJsonByPath(currentJson, nodeData.path, editedData);
      
      // Convert back to string with formatting
      const updatedJsonString = JSON.stringify(updatedJson, null, 2);
      
      // Update both the JSON store (for graph) AND the file store (for text editor)
      setJson(updatedJsonString);
      setContents({ contents: updatedJsonString, hasChanges: true });
      
      // Reset edit state and close modal
      resetEditState();
      onClose();
    } catch (error) {
      console.error("Error saving node data:", error);
      alert("Failed to save changes. Please check the console for details.");
    }
  };

  const handleCancel = () => {
    cancelEditing();
  };

  const handleValueChange = (index: number, newValue: string) => {
    if (!editedData) return;
    
    const updated = [...editedData];
    updated[index] = { ...updated[index], value: newValue };
    updateEditedData(updated);
  };

  const handleClose = () => {
    resetEditState();
    onClose();
  };

  const displayData = isEditing ? editedData : nodeData?.text;

  return (
    <Modal size="auto" opened={opened} onClose={handleClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <CloseButton onClick={handleClose} />
          </Flex>
          
          {isEditing ? (
            <ScrollArea.Autosize mah={250} maw={600}>
              <Stack gap="xs" miw={350}>
                {editedData?.map((row, index) => {
                  // Skip array and object types (they're references)
                  if (row.type === "array" || row.type === "object") {
                    return (
                      <Group key={index} gap="xs">
                        {row.key && <Text size="xs" fw={500}>{row.key}:</Text>}
                        <Text size="xs" c="dimmed">
                          {row.type === "array" ? `[${row.childrenCount ?? 0} items]` : `{${row.childrenCount ?? 0} keys}`}
                        </Text>
                      </Group>
                    );
                  }
                  
                  return (
                    <Group key={index} gap="xs" align="center">
                      {row.key && <Text size="xs" fw={500} miw={80}>{row.key}:</Text>}
                      <TextInput
                        size="xs"
                        value={row.value?.toString() ?? ""}
                        onChange={(e) => handleValueChange(index, e.currentTarget.value)}
                        style={{ flex: 1 }}
                        placeholder="Enter value"
                      />
                    </Group>
                  );
                })}
              </Stack>
            </ScrollArea.Autosize>
          ) : (
            <ScrollArea.Autosize mah={250} maw={600}>
              <CodeHighlight
                code={normalizeNodeData(displayData ?? [])}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
            </ScrollArea.Autosize>
          )}
        </Stack>
        
        {/* Action Buttons */}
        <Flex gap="sm" justify="flex-end">
          {!isEditing ? (
            <Button size="xs" onClick={handleEdit}>
              Edit
            </Button>
          ) : (
            <>
              <Button size="xs" variant="default" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="xs" onClick={handleSave}>
                Save
              </Button>
            </>
          )}
        </Flex>
        
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
