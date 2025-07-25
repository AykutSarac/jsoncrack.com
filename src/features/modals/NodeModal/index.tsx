import React, { useState } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Button, Group, Textarea } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import useGraph from "../../editor/views/GraphView/stores/useGraph";

const dataToString = (data: any) => {
  const text = Array.isArray(data) ? Object.fromEntries(data) : data;
  const replacer = (_: string, v: string) => {
    if (typeof v === "string") return v.replaceAll('"', "");
    return v;
  };

  return JSON.stringify(text, replacer, 2);
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const selectedNode = useGraph(state => state.selectedNode);
  const nodeData = dataToString(selectedNode?.text);
  const path = selectedNode?.path || "";

  // Add edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(nodeData);
  const updateNodeContent = useGraph(state => state.updateNodeContent); // You may need to implement this in your Zustand store

  // Reset edit value when node changes or modal opens
  React.useEffect(() => {
    setEditValue(nodeData);
    setIsEditing(false);
  }, [nodeData, opened]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditValue(nodeData);
    setIsEditing(false);
  };
  const handleSubmit = () => {
    try {
      // Parse and update node content
      const parsed = JSON.parse(editValue);
      updateNodeContent(parsed, path); // You need to implement this action in your Zustand store
      setIsEditing(false);
    } catch (e) {
      alert("Invalid JSON");
    }
  };

  return (
    <Modal title="Node Content" size="auto" opened={opened} onClose={onClose} centered>
      <Stack py="sm" gap="sm">
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            {!isEditing && (
              <Button size="xs" variant="light" onClick={handleEdit}>
                Edit
              </Button>
            )}
          </Group>
          <ScrollArea.Autosize mah={250} maw={600}>
            {isEditing ? (
              <Stack>
                <Textarea
                  value={editValue}
                  onChange={e => setEditValue(e.currentTarget.value)}
                  minRows={6}
                  autosize
                  maw={600}
                  miw={350}
                  styles={{ input: { fontFamily: "monospace" } }}
                />
                <Group mt="xs">
                  <Button size="xs" color="green" onClick={handleSubmit}>
                    Submit
                  </Button>
                  <Button size="xs" variant="default" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Group>
              </Stack>
            ) : (
              <CodeHighlight code={nodeData} miw={350} maw={600} language="json" withCopyButton />
            )}
          </ScrollArea.Autosize>
        </Stack>
        <Text fz="xs" fw={500}>
          JSON Path
        </Text>
        <ScrollArea.Autosize maw={600}>
          <CodeHighlight
            code={path}
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