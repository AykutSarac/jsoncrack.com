/**
 * Example Node Edit Modal showing how to update JSON values
 * This demonstrates the complete edit flow with save/cancel actions
 */
import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, TextInput, Group, Button, Flex, CloseButton } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import { parseValueInput } from "../../../lib/utils/updateJsonByPath";
import useJson from "../../../store/useJson";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";

export const NodeEditModal = ({ opened, onClose }: ModalProps) => {
  const selectedNode = useGraph(state => state.selectedNode);
  const updateNodeValue = useJson(state => state.updateNodeValue);
  const [tempValue, setTempValue] = React.useState("");
  const [originalValue, setOriginalValue] = React.useState("");

  // Initialize edit state when modal opens with new node
  React.useEffect(() => {
    if (selectedNode && opened) {
      const nodeValue = JSON.stringify(selectedNode.text[0].value);
      setOriginalValue(nodeValue);
      setTempValue(nodeValue);
    }
  }, [selectedNode, opened]);

  const handleSave = React.useCallback(() => {
    if (selectedNode) {
      // Update the JSON with new value
      updateNodeValue(selectedNode.path, tempValue);
      onClose();
    }
  }, [selectedNode, tempValue, updateNodeValue, onClose]);

  const handleCancel = React.useCallback(() => {
    // Reset to original value
    setTempValue(originalValue);
    onClose();
  }, [originalValue, onClose]);

  // Format JSON path for display (e.g., ["user", "name"] → $.user.name)
  const formatPath = (path: NodeData["path"]) => {
    if (!path || path.length === 0) return "$";
    const segments = path.map(seg => (typeof seg === "number" ? `[${seg}]` : `.${seg}`));
    return `$${segments.join("")}`;
  };

  if (!selectedNode) return null;

  const parsedNewValue = parseValueInput(tempValue);

  return (
    <Modal size="auto" opened={opened} onClose={handleCancel} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Text fz="sm" fw={600}>
            Edit Node Value
          </Text>
          <CloseButton onClick={handleCancel} />
        </Flex>

        {/* Path Display */}
        <div>
          <Text fz="xs" c="dimmed" mb="xs">
            Path
          </Text>
          <code
            style={{
              display: "block",
              padding: "8px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            {formatPath(selectedNode.path)}
          </code>
        </div>

        {/* Input Field */}
        <div>
          <Text fz="xs" fw={500} mb="xs">
            Value
          </Text>
          <TextInput
            placeholder="Enter new value"
            value={tempValue}
            onChange={e => setTempValue(e.currentTarget.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
          />
          <Text fz="xs" c="dimmed" mt="xs">
            Type:{" "}
            {typeof parsedNewValue === "object"
              ? Array.isArray(parsedNewValue)
                ? "array"
                : "object"
              : typeof parsedNewValue}
          </Text>
        </div>

        {/* Preview */}
        <div>
          <Text fz="xs" fw={500} mb="xs">
            Preview
          </Text>
          <CodeHighlight
            code={JSON.stringify(parsedNewValue, null, 2)}
            language="json"
            miw={300}
            maw={500}
          />
        </div>

        {/* Actions */}
        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </Group>
      </Stack>
    </Modal>
  );
};
