import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, TextInput, Group } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import toast from "react-hot-toast";
import type { NodeData, NodeRow } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useFile from "../../../store/useFile";
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

// Navigate to the object at the given path and return it
const getValueAtPath = (json: any, path: (string | number)[]): any => {
  if (!path || path.length === 0) return json;

  let current = json;
  for (const key of path) {
    current = current[key];
  }
  return current;
};

// Update a specific key within an object at the given path
const updateKeyInObjectAtPath = (json: any, path: (string | number)[], key: string, newValue: any): any => {
  const result = JSON.parse(JSON.stringify(json));
  
  if (!path || path.length === 0) {
    // Update at root level
    result[key] = newValue;
  } else {
    // Navigate to the parent object and update the key
    let current = result;
    for (const pathKey of path) {
      current = current[pathKey];
    }
    current[key] = newValue;
  }

  return result;
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);
  const getContents = useFile(state => state.getContents);
  const setContents = useFile(state => state.setContents);
  const getJson = useJson(state => state.getJson);
  const getFormat = useFile(state => state.getFormat);

  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editValues, setEditValues] = React.useState<Record<number, string>>({});

  React.useEffect(() => {
    if (opened && nodeData) {
      const initialValues: Record<number, string> = {};
      nodeData.text.forEach((row, idx) => {
        initialValues[idx] = String(row.value ?? "");
      });
      setEditValues(initialValues);
    }
  }, [opened, nodeData]);

  const handleEditChange = (index: number, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleSaveChanges = () => {
    if (!nodeData || !nodeData.path) return;

    try {
      const json = JSON.parse(getJson());
      let updatedJson = json;

      // Update each modified value
      nodeData.text.forEach((row, idx) => {
        // Use edited value if provided, otherwise default to original value
        const newValue = editValues[idx]?.trim() || String(row.value ?? "");
        
        // Only update if value actually changed
        if (newValue !== String(row.value ?? "")) {
          // Try to parse as JSON first (for numbers, booleans, null)
          let parsedValue: any = newValue;
          try {
            parsedValue = JSON.parse(newValue);
          } catch {
            // Keep as string if JSON parse fails
          }

          // Update the specific key within the object at the path
          if (row.key) {
            updatedJson = updateKeyInObjectAtPath(updatedJson, nodeData.path ?? [], row.key, parsedValue);
          }
        }
      });

      setContents({
        contents: JSON.stringify(updatedJson, null, 2),
        format: getFormat(),
      });

      toast.success("Node values updated successfully!");
      setIsEditMode(false);
      onClose();
    } catch (error) {
      toast.error("Failed to update node values");
      console.error(error);
    }
  };

  const handleClose = () => {
    setIsEditMode(false);
    setEditValues({});
    onClose();
  };

  // Filter out dictionary/object values - only show editable primitive values
  const editableRows = nodeData?.text.filter(row => row.type !== "object" && row.type !== "array") ?? [];
  const hasEditableValues = editableRows.length > 0;

  return (
    <Modal size="auto" opened={opened} onClose={handleClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              {isEditMode ? "Edit Content" : "Content"}
            </Text>
            <Group gap="xs" ml="auto">
              {!isEditMode && (
                <Button 
                  variant="filled" 
                  size="xs" 
                  onClick={() => setIsEditMode(true)}
                  disabled={!hasEditableValues}
                  title={!hasEditableValues ? "No editable values (dictionaries cannot be edited)" : ""}
                >
                  Edit
                </Button>
              )}
              <CloseButton onClick={handleClose} />
            </Group>
          </Flex>

          {isEditMode ? (
            <Stack gap="sm">
              {editableRows.map((row, idx) => (
                <div key={idx}>
                  {row.key && (
                    <Text fz="xs" fw={500} mb={4}>
                      {row.key}
                    </Text>
                  )}
                  <TextInput
                    placeholder={row.type === "string" ? "Enter text value" : "Enter value"}
                    value={editValues[idx] ?? ""}
                    onChange={e => handleEditChange(idx, e.currentTarget.value)}
                    data-autofocus={idx === 0}
                  />
                </div>
              ))}
              <Group justify="flex-end" gap="xs">
                <Button
                  variant="default"
                  size="xs"
                  onClick={() => {
                    setIsEditMode(false);
                    setEditValues({});
                  }}
                >
                  Cancel
                </Button>
                <Button variant="filled" size="xs" onClick={handleSaveChanges}>
                  Save
                </Button>
              </Group>
            </Stack>
          ) : (
            <ScrollArea.Autosize mah={250} maw={600}>
              <CodeHighlight
                code={normalizeNodeData(nodeData?.text ?? [])}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
            </ScrollArea.Autosize>
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
