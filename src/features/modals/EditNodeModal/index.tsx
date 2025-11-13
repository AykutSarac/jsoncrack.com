import React from "react";
import type { ModalProps } from "@mantine/core";
import {
  Modal,
  Stack,
  Text,
  TextInput,
  Textarea,
  Button,
  Group,
  Flex,
  CloseButton,
  Alert,
  Select,
} from "@mantine/core";
import { LuInfo } from "react-icons/lu";
import type { NodeData, NodeRow } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson";
import useFile from "../../../store/useFile";
import { FileFormat } from "../../../enums/file.enum";

interface EditableField {
  key: string | null;
  value: string;
  originalValue: string | number | null;
  type: NodeRow["type"];
  index: number;
}

const parseValueByType = (value: string, type: NodeRow["type"]): any => {
  if (value === "") return null;

  switch (type) {
    case "number":
      const num = Number(value);
      return isNaN(num) ? value : num;
    case "boolean":
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
      return value;
    case "null":
      return null;
    case "string":
      return value;
    default:
      // Try to parse as JSON for auto-detection
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
  }
};

const setValueAtPath = (obj: any, path: (string | number)[], value: any): void => {
  if (!path || path.length === 0) return;
  
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    if (current[path[i]] === undefined) return;
    current = current[path[i]];
  }
  current[path[path.length - 1]] = value;
};

export const EditNodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);
  const getJson = useJson(state => state.getJson);
  const setContents = useFile(state => state.setContents);
  
  const [editableFields, setEditableFields] = React.useState<EditableField[]>([]);
  const [error, setError] = React.useState<string>("");
  const [isComplexNode, setIsComplexNode] = React.useState(false);

  React.useEffect(() => {
    if (nodeData?.text) {
      // Check if node contains only editable (primitive) values
      const hasComplexTypes = nodeData.text.some(
        row => row.type === "object" || row.type === "array"
      );
      
      setIsComplexNode(hasComplexTypes);

      // Create editable fields only for primitive values
      const fields: EditableField[] = nodeData.text
        .map((row, index) => ({
          key: row.key,
          value: String(row.value ?? ""),
          originalValue: row.value,
          type: row.type,
          index,
        }))
        .filter(field => 
          field.type !== "object" && field.type !== "array"
        );

      setEditableFields(fields);
      setError("");
    }
  }, [nodeData]);

  const handleFieldChange = (index: number, value: string) => {
    setEditableFields(prev =>
      prev.map((field, i) => (i === index ? { ...field, value } : field))
    );
  };

  const handleSave = () => {
    try {
      // Get current JSON
      const currentJson = getJson();
      const jsonObject = JSON.parse(currentJson);

      // If this is a root primitive value (no path or empty path)
      if (!nodeData?.path || nodeData.path.length === 0) {
        if (editableFields.length === 1) {
          const field = editableFields[0];
          const newValue = parseValueByType(field.value, field.type);
          
          // Update with the new primitive value
          setContents({
            contents: JSON.stringify(newValue, null, 2),
            format: FileFormat.JSON,
          });
          
          onClose();
          return;
        }
      }

      // For nested values, update at the specific path
      editableFields.forEach(field => {
        const fieldPath = nodeData?.path ? [...nodeData.path] : [];
        
        // If the field has a key, append it to the path
        if (field.key) {
          fieldPath.push(field.key);
        }

        const newValue = parseValueByType(field.value, field.type);
        setValueAtPath(jsonObject, fieldPath, newValue);
      });

      // Update the editor content
      setContents({
        contents: JSON.stringify(jsonObject, null, 2),
        format: FileFormat.JSON,
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update JSON");
    }
  };

  const handleCancel = () => {
    setError("");
    onClose();
  };

  return (
    <Modal
      size="lg"
      opened={opened}
      onClose={handleCancel}
      centered
      withCloseButton={false}
      title={null}
    >
      <Stack gap="md" pb="sm">
        <Flex justify="space-between" align="center">
          <Text fz="lg" fw={600}>
            Edit Node Value
          </Text>
          <CloseButton onClick={handleCancel} />
        </Flex>

        {isComplexNode && (
          <Alert icon={<LuInfo size={16} />} color="blue" variant="light">
            This node contains nested objects or arrays. Only primitive values can be edited.
          </Alert>
        )}

        {error && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}

        {nodeData?.path && nodeData.path.length > 0 && (
          <Text fz="xs" c="dimmed">
            Path: {nodeData.path.map(p => `[${typeof p === "number" ? p : `"${p}"`}]`).join("")}
          </Text>
        )}

        <Stack gap="sm">
          {editableFields.length === 0 ? (
            <Alert icon={<LuInfo size={16} />} color="yellow" variant="light">
              This node contains no editable primitive values. Only strings, numbers, booleans, and
              null values can be edited directly.
            </Alert>
          ) : (
            editableFields.map((field, index) => (
              <div key={index}>
                {field.key && (
                  <Text fz="xs" fw={500} mb={4}>
                    {field.key}
                  </Text>
                )}
                {field.value.length > 50 || field.value.includes("\n") ? (
                  <Textarea
                    value={field.value}
                    onChange={e => handleFieldChange(index, e.target.value)}
                    placeholder="Enter value"
                    autosize
                    minRows={2}
                    maxRows={6}
                  />
                ) : (
                  <TextInput
                    value={field.value}
                    onChange={e => handleFieldChange(index, e.target.value)}
                    placeholder="Enter value"
                  />
                )}
                <Text fz="xs" c="dimmed" mt={2}>
                  Type: {field.type}
                </Text>
              </div>
            ))
          )}
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={editableFields.length === 0}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
