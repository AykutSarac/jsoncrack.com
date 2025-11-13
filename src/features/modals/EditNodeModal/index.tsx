import React, { useState, useEffect } from "react";
import type { ModalProps } from "@mantine/core";
import {
  Modal,
  Stack,
  Text,
  TextInput,
  Group,
  Button,
  Flex,
  CloseButton,
  Alert,
} from "@mantine/core";
import useJson from "../../../store/useJson";
import useGraph from "../../editor/views/GraphView/stores/useGraph";

/**
 * EditNodeModal - Provides UI for editing node values in the visualization
 * Includes Edit/Save/Cancel buttons and updates both visualization and JSON editor
 */
export const EditNodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);
  const json = useJson(state => state.json);
  const setJson = useJson(state => state.setJson);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");

  // Initialize edit value when node is selected or modal opens
  useEffect(() => {
    if (opened && nodeData) {
      // Get the first text row value (the actual value being edited)
      const firstRow = nodeData.text[0];
      if (firstRow && firstRow.value !== null) {
        setEditValue(String(firstRow.value));
        setError("");
      }
    }
  }, [opened, nodeData]);

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    if (nodeData) {
      const firstRow = nodeData.text[0];
      if (firstRow && firstRow.value !== null) {
        setEditValue(String(firstRow.value));
      }
    }
  };

  const handleSave = () => {
    if (!nodeData || !nodeData.path) {
      setError("Cannot determine node path");
      return;
    }

    try {
      // Parse the current JSON
      const jsonObj = JSON.parse(json);

      // Navigate to the correct location in the JSON using the path
      let current = jsonObj;
      for (let i = 0; i < nodeData.path.length - 1; i++) {
        current = current[nodeData.path[i]];
      }

      // Update the value at the final path location
      const lastKey = nodeData.path[nodeData.path.length - 1];

      // Try to parse as JSON type if possible (number, boolean, etc.)
      let newValue: any = editValue;
      if (editValue === "null") {
        newValue = null;
      } else if (editValue === "true") {
        newValue = true;
      } else if (editValue === "false") {
        newValue = false;
      } else if (!isNaN(Number(editValue)) && editValue !== "") {
        newValue = Number(editValue);
      } else if (editValue.startsWith("{") || editValue.startsWith("[")) {
        newValue = JSON.parse(editValue);
      }

      current[lastKey] = newValue;

      // Update the JSON in the store (this will trigger graph re-render)
      setJson(JSON.stringify(jsonObj));

      // Exit edit mode and close modal
      setIsEditing(false);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update node value");
    }
  };

  const getNodeLabel = () => {
    if (!nodeData || nodeData.text.length === 0) return "Unknown";
    const firstRow = nodeData.text[0];
    return firstRow.key ? `${firstRow.key}` : "Value";
  };

  return (
    <Modal
      size="md"
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      title={isEditing ? "Edit Node Value" : "Node Details"}
    >
      <Stack pb="sm" gap="md">
        <Flex justify="space-between" align="center">
          <Text fz="sm" fw={500}>
            {getNodeLabel()}
          </Text>
          <CloseButton onClick={onClose} />
        </Flex>

        {error && (
          <Alert color="red" title="Error">
            {error}
          </Alert>
        )}

        {isEditing ? (
          <Stack gap="md">
            <TextInput
              label="New Value"
              placeholder="Enter new value"
              value={editValue}
              onChange={e => setEditValue(e.currentTarget.value)}
              autoFocus
              description="Enter the new value. Numbers, booleans (true/false), null, and JSON objects/arrays are supported."
            />
            <Group grow>
              <Button variant="light" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} color="blue">
                Save
              </Button>
            </Group>
          </Stack>
        ) : (
          <Stack gap="md">
            <Stack gap="xs">
              <Text fz="xs" fw={500}>
                Current Value
              </Text>
              <TextInput readOnly value={editValue} style={{ cursor: "default" }} />
            </Stack>
            <Button onClick={handleEdit} fullWidth color="blue">
              Edit
            </Button>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
};
