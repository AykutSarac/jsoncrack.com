import React, { useState } from "react";
import type { ModalProps } from "@mantine/core";
import {
  Modal,
  Stack,
  Text,
  ScrollArea,
  Button,
  Group,
  Textarea,
} from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useFile from "../../../store/useFile";
import useJson from "../../../store/useJson";

const dataToString = (data: any) => {
  const text = Array.isArray(data) ? Object.fromEntries(data) : data;
  return JSON.stringify(text, null, 2);
};

function setDeepValue(obj: any, path: string, value: any): void {
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
  }
  console.log(`Setting value at path: ${keys.join('.')}`);
  current[keys[keys.length - 1]] = value;

};


export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const rawData = useGraph(state => state.selectedNode?.text);
  const nodeData = dataToString(rawData);
  const path = useGraph(state => state.selectedNode?.path || "");
  const trimmedPath = path.slice(7);

  // Get the last segment of the path
  const pathSegments = trimmedPath.split(".");
  const lastSegment = pathSegments[pathSegments.length - 1];

  // Only allow editing if rawData is NOT the same as the last segment of the path
  const canEdit = String(rawData) !== lastSegment;

  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(nodeData);

  const handleEdit = () => {
    setEditedValue(nodeData); // reset to original content
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedValue(nodeData);
    setIsEditing(false);
  };

  const handleSave = () => {
    try {
      const newVal = JSON.parse(editedValue); // value user typed
      const fullJson = JSON.parse(useFile.getState().getContents()); // current root JSON

      setDeepValue(fullJson, trimmedPath, newVal); // mutate the value at correct path
      const updatedStr = JSON.stringify(fullJson, null, 2);

      useFile.getState().setContents({ contents: updatedStr }); // update store
      useJson.getState().setJson(updatedStr); // update graph
      setIsEditing(false);
      onClose(); // optional
    } catch (err) {
      alert("Invalid JSON: Make sure the value is valid JSON.");
    }
};

  return (
    <Modal title="Node Content" size="auto" opened={opened} onClose={onClose} centered>
      <Stack py="sm" gap="sm">
        <Group justify="space-between">
          <Text fz="xs" fw={500}>Content</Text>
          {!isEditing ? (
            canEdit && (
              <Button size="xs" variant="light" onClick={handleEdit}>Edit</Button>
            )
          ) : (
            <Group gap="xs">
              <Button size="xs" color="green" onClick={handleSave}>Save</Button>
              <Button size="xs" color="gray" onClick={handleCancel}>Cancel</Button>
            </Group>
          )}
        </Group>

        {isEditing ? (
          <Textarea
            value={editedValue}
            onChange={e => setEditedValue(e.currentTarget.value)}
            minRows={6}
            autosize
            spellCheck={false}
            styles={{ input: { fontFamily: "monospace", whiteSpace: "pre" } }}
          />
        ) : (
          <ScrollArea.Autosize mah={250} maw={600}>
            <CodeHighlight
              code={nodeData}
              miw={350}
              maw={600}
              language="json"
              withCopyButton
            />
          </ScrollArea.Autosize>
        )}

        <Text fz="xs" fw={500}>JSON Path</Text>
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
