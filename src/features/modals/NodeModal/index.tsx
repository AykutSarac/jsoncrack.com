import React, {useState, useEffect} from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Button } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import { Textarea, Group } from "@mantine/core";
import useJson from "../../../store/useJson";

const dataToString = (data: any) => {
  /*const text = Array.isArray(data) ? Object.fromEntries(data) : data;
  const replacer = (_: string, v: string) => {
    if (typeof v === "string") return v.replaceAll('"', "");
    return v;
  };*/

  // return JSON.stringify(text, replacer, 2);
  if (!data) return "{}";
  if (Array.isArray(data) && data.every(item => Array.isArray(item) && item.length === 2)) {
    return JSON.stringify(Object.fromEntries(data), null, 2);
  }
  return JSON.stringify(data, null, 2);
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => dataToString(state.selectedNode?.text));
  const path = useGraph(state => state.selectedNode?.path || "");
  const selectedNode = useGraph(state => state.selectedNode);
  const updateNode = useGraph(state => state.updateNode); // Make sure you have this action in your store
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(nodeData);

  useEffect(() => {
  setIsEditing(false);
  // Only set editValue if nodeData is valid JSON
  try {
    JSON.parse(nodeData);
    setEditValue(nodeData);
  } catch {
    setEditValue("{}"); // fallback to empty object
  }
}, [opened, nodeData]);

// Handler for edit button click
  const handleEdit = () => {
    // Add your edit logic here (e.g., open another modal, set edit state, etc.)
    setEditValue(nodeData);
    setIsEditing(true);
    console.log("Edit button clicked");
  };

  // Save changes
  const handleSave = () => {
  try {
    console.log("handleSave called");

    if (typeof editValue !== "string") {
      console.log("editValue is not a string:", editValue);
      alert("Invalid JSON");
      return;
    }

    const parsed = JSON.parse(editValue);
    console.log("parsed value:", parsed);

    const id = selectedNode?.id;
    const path = selectedNode?.path;

    if (!id || !path) {
      alert("No node selected.");
      return;
    }

    const isEntryList =
      Array.isArray(selectedNode?.data) &&
      selectedNode.data.every((item: any) => Array.isArray(item) && item.length === 2);

    if (isEntryList) {
      const asArray = Object.entries(parsed);
      console.log("Saving as entry list:", asArray);
      updateNode(id, asArray);
      useJson.getState().updateJson(path, asArray);
    } else {
      console.log("Saving as object:", parsed);
      updateNode(id, parsed);
      useJson.getState().updateJson(path, parsed);
    }

    setIsEditing(false);
    console.log("Save successful");
  } catch (e) {
    console.log("JSON parse error:", e);
    alert("Invalid JSON");
  }
};

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(nodeData);
  };

  return (
    <Modal
    title={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <span>Node Content</span>
        <Button size="xs" variant="outline" color="blue" onClick={handleEdit} style={{ marginRight: "auto" }}>
          Edit
        </Button>
      </div>
    }
    size="auto"
    opened={opened}
    onClose={onClose}
    centered
    >

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
          <Button size="xs" color="green" onClick={handleSave}>
            Save
          </Button>
          <Button size="xs" variant="outline" color="gray" onClick={handleCancel}>
            Cancel
          </Button>
        </Group>
        </Stack>
    ) : (
      <ScrollArea.Autosize mah={250} maw={600}>
        <CodeHighlight code={JSON.stringify(selectedNode?.data, null, 2)} />
      </ScrollArea.Autosize>
    )}

      
    </Modal>
  );
};
