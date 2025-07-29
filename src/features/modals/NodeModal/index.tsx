import React, { useState } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Button, Group, Textarea } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useFile from "../../../store/useFile";

const dataToString = (data: any) => {
  const text = Array.isArray(data) ? Object.fromEntries(data) : data;
  return JSON.stringify(text, null, 2); // <-- No replacer!
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const selectedNode = useGraph(state => state.selectedNode);
  const nodeData = dataToString(selectedNode?.text);
  const path = selectedNode?.path || "";

  // Add editing state
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(nodeData);

  // Optional: update editValue when nodeData changes (e.g., when opening a new node)
  React.useEffect(() => {
    setEditValue(nodeData);
    setEditing(false);
  }, [nodeData, opened]);


  const setContents = useFile(state => state.setContents);
  const json = useFile(state => state.fileData);
  const handleSave = () => {
    try {
      if (!editValue) {
        alert("Nothing to save!");
        return;
      }
      const newValue = JSON.parse(editValue);

      const pathArr = Array.isArray(selectedNode?.path)
        ? selectedNode.path
        : (selectedNode?.path || "")
            .replace(/^{Root}\.?/, "")
            .split(".")
            .filter(Boolean);

      const updatedJson = JSON.parse(JSON.stringify(json));

      if (pathArr.length === 0) {
        // Editing the root node
        setContents({ contents: JSON.stringify(newValue, null, 2) });
      } else {
        let obj = updatedJson;
        for (let i = 0; i < pathArr.length - 1; i++) {
          const key = pathArr[i];
          if (typeof obj[key] !== "object" || obj[key] === null) {
            obj[key] = {}; // Overwrite null or non-object with an object
          }
          obj = obj[key];
        }

        // Validate final obj before assignment
        if (obj && typeof obj === "object") {
          obj[pathArr[pathArr.length - 1]] = newValue;
          setContents({ contents: JSON.stringify(updatedJson, null, 2) });
        } else {
          console.error("Cannot assign to a null object at target path.");
          alert("Failed to save: Invalid target path in JSON.");
          return;
        }
      }

      setEditing(false);
      onClose();
    } catch (e) {
      console.error("Save error:", e);
      alert("Invalid JSON format!");
    }
  };

  return (
    <Modal title="Node Content" size="auto" opened={opened} onClose={onClose} centered>
      <Stack py="sm" gap="sm">
        <Stack gap="xs">
          <Text fz="xs" fw={500}>
            Content
          </Text>
          <ScrollArea.Autosize mah={250} maw={600}>
            {editing ? (
              <Textarea
                autosize
                minRows={6}
                maxRows={12}
                value={editValue}
                onChange={e => setEditValue(e.currentTarget.value)}
                styles={{ input: { fontFamily: "monospace" } }}
                miw={350}
                maw={600}
              />
            ) : (
              <CodeHighlight code={nodeData} miw={350} maw={600} language="json" withCopyButton />
            )}
          </ScrollArea.Autosize>
          <Group mt="xs">
            {editing ? (
              <>
                <Button size="xs" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  size="xs"
                  variant="default"
                  onClick={() => {
                    setEditValue(nodeData);
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button size="xs" onClick={() => setEditing(true)}>
                Edit
              </Button>
            )}
          </Group>
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

