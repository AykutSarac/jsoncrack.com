import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import { Button, TextInput } from "@mantine/core";

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
  const nodeData = selectedNode?.text;
  const path = selectedNode?.path || "";
  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState<any>(nodeData);
  const updateNodeData = useGraph(state => state.updateNodeData);

  // Reset editData when node changes or modal opens
  React.useEffect(() => {
    setEditData(nodeData);
    setIsEditing(false);
  }, [nodeData, opened]);
  

  return (
    <Modal title="Node Content" size="auto" opened={opened} onClose={onClose} centered>
      <Stack py="sm" gap="sm">
        <Stack gap="xs">
          <Text fz="xs" fw={500}>
            Content
          </Text>
          <ScrollArea.Autosize mah={250} maw={600}>
            {!isEditing ? (
              <CodeHighlight code={dataToString(nodeData)} miw={350} maw={600} language="json" withCopyButton />
            ) : (
              // Render editable fields for each property in editData
              <Stack>
                {editData &&
                  Object.entries(editData).map(([key, value]) => (
                    <TextInput
                      key={key}
                      label={key}
                      value={value}
                      onChange={e => {
                        let newValue: any = e.target.value;
                        // Try to preserve original type
                        if (typeof nodeData[key] === "number") {
                          newValue = Number(newValue);
                          if (isNaN(newValue)) newValue = ""; // fallback for invalid numbers
                        }
                        setEditData({ ...editData, [key]: newValue });
                      }}
                    />
                  ))}
              </Stack>
            )}
          </ScrollArea.Autosize>
          <Stack direction="row" gap="xs" mt="xs">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    if (selectedNode?.path) {
                      updateNodeData(selectedNode.path, editData);
                      setIsEditing(false);
                    }
                  }}
                >
                  Save
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </>
            )}
          </Stack>
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
