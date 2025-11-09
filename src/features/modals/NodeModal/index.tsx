import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import useFile from "../../../store/useFile";
import useJson from "../../../store/useJson";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";

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

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);
  const setJson = useJson(state => state.setJson);
  const setContents = useFile(state => state.setContents);

  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState("");

  React.useEffect(() => {
    if (!opened) {
      return;
    }
    setIsEditing(false);
    setEditValue("");
  }, [opened]);

  const handleEdit = () => {
    let textRows: NodeData["text"] = [];
    if (nodeData && nodeData.text) {
      textRows = nodeData.text;
    }
    const formatted = normalizeNodeData(textRows);
    setEditValue(formatted);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!nodeData) {
      handleCancel();
      return;
    }

    if (!nodeData.path) {
      handleCancel();
      return;
    }

    const currentJson = useJson.getState().json;
    const { modify, applyEdits } = await import("jsonc-parser");

    let parsedValue;
    try {
      parsedValue = JSON.parse(editValue);
    } catch (error) {
      parsedValue = editValue;
    }

    let updatedJson = currentJson;
    let isValue = false;

    if (nodeData.text.length === 1) {
      const firstRow = nodeData.text[0];
      if (firstRow.key === undefined) {
        isValue = true;
      }
    }

    if (isValue) {
      const edits = modify(updatedJson, nodeData.path, parsedValue, {
        formattingOptions: { insertSpaces: true, tabSize: 2 },
      });
      updatedJson = applyEdits(updatedJson, edits);
    }

    if (!isValue) {
      for (const entry of Object.entries(parsedValue)) {
        const key = entry[0];
        const value = entry[1];
        const newPath = nodeData.path.concat(key);
        const edits = modify(updatedJson, newPath, value, {
          formattingOptions: { insertSpaces: true, tabSize: 2 },
        });
        updatedJson = applyEdits(updatedJson, edits);
      }
    }

    setJson(updatedJson);
    setContents({ contents: updatedJson, hasChanges: true });
    setIsEditing(false);
    onClose();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue("");
  };

  if (!nodeData) {
    return null;
  }

  let textRows: NodeData["text"] = [];
  if (nodeData) {
    if (nodeData.text) {
      textRows = nodeData.text;
    }
  }

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
          <Flex gap="sm" justify="flex-end">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  style={{
                    fontSize: "12px",
                    backgroundColor: "rgb(46, 155, 83)",
                    padding: "5px 10px",
                  }}
                >
                  Save
                </Button>
                <Button
                  style={{
                    fontSize: "12px",
                    backgroundColor: "rgb(61, 62, 62)",
                    padding: "5px 10px",
                  }}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                style={{
                  fontSize: "12px",
                  backgroundColor: "rgb(78, 150, 188)",
                  padding: "5px 10px",
                }}
                onClick={handleEdit}
              >
                Edit
              </Button>
            )}
          </Flex>
          <ScrollArea.Autosize>
            {isEditing ? (
              <textarea
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "200px",
                  maxHeight: 350,
                  maxWidth: 600,
                }}
              />
            ) : (
              <CodeHighlight
                code={normalizeNodeData(textRows)}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
            )}
          </ScrollArea.Autosize>
        </Stack>
      </Stack>
    </Modal>
  );
};
