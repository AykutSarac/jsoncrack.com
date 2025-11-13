import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, Group, Textarea } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useFile from "../../../store/useFile";
import useJson from "../../../store/useJson";
import toast from "react-hot-toast";

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

const setNestedValue = (obj: any, path: (string | number)[], value: any) => {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!(key in current)) {
      current[key] = typeof path[i + 1] === "number" ? [] : {};
    }
    current = current[key];
  }
  current[path[path.length - 1]] = value;
  return obj;
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);
  const setContents = useFile(state => state.setContents);
  const getJson = useJson(state => state.getJson);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState("");

  React.useEffect(() => {
    if (opened && nodeData) {
      setEditValue(normalizeNodeData(nodeData?.text ?? []));
    }
  }, [opened, nodeData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    try {
      JSON.parse(editValue);
      const fullJson = JSON.parse(getJson());
      const parsedEditValue = JSON.parse(editValue);
      
      // Get the current node to preserve child nodes
      let current = fullJson;
      for (const key of nodeData?.path ?? []) {
        current = current[key];
      }
      
      // Merge edited value with existing children
      const mergedValue = typeof current === "object" && current !== null
        ? { ...current, ...parsedEditValue }
        : parsedEditValue;
      
      const updatedJson = setNestedValue(fullJson, nodeData?.path ?? [], mergedValue);
      setContents({ contents: JSON.stringify(updatedJson, null, 2) });
      setIsEditing(false);
      onClose();
      toast.success("Node updated successfully!");
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  };

  const handleCancel = () => {
    setEditValue(normalizeNodeData(nodeData?.text ?? []));
    setIsEditing(false);
  };

  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <CloseButton onClick={onClose} />
          </Flex>
          <ScrollArea.Autosize mah={500} maw={600}>
            {isEditing ? (
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.currentTarget.value)}
                placeholder="Enter JSON data..."
                minRows={6}
                maxRows={12}
                style={{ fontFamily: "monospace", fontSize: "12px" }}
              />
            ) : (
              <CodeHighlight
                code={editValue}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
            )}
          </ScrollArea.Autosize>
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
        <Group justify="flex-end">
          {isEditing ? (
            <>
              <Button variant="default" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} fullWidth>
              Edit Node
            </Button>
          )}
        </Group>
      </Stack>
    </Modal>
  );
};
