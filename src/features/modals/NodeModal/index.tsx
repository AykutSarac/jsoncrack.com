import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, TextInput, Group } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson";
import useFile from "../../../store/useFile";
import { modify, applyEdits } from "jsonc-parser";

// return object from json removing array and object fields
const normalizeNodeData = (nodeRows: NodeData["text"]) => {
  if (!nodeRows || nodeRows.length === 0) return "{}";
  if (nodeRows.length === 1 && !nodeRows[0].key) return `${nodeRows[0].value}`;

  const obj = {} as Record<string, any>;
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

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);
  const setGraph = useGraph(state => state.setGraph);
  const [isEditing, setIsEditing] = React.useState(false);
  const [nameValue, setNameValue] = React.useState("");
  const [colorValue, setColorValue] = React.useState("");

  const currentJson = useJson(state => state.json);
  const setJson = useJson(state => state.setJson);
  const setContents = useFile(state => state.setContents);

  React.useEffect(() => {
    // populate inputs when opening editor
    if (opened && nodeData) {
      const nameRow = nodeData.text.find(r => r.key === "name");
      const colorRow = nodeData.text.find(r => r.key === "color");
      setNameValue(String(nameRow?.value ?? ""));
      setColorValue(String(colorRow?.value ?? ""));
    } else {
      setIsEditing(false);
    }
  }, [opened, nodeData]);

  const handleSave = React.useCallback(async () => {
    if (!nodeData) return;

    try {
      let updated = currentJson;
      const basePath = nodeData.path ?? [];

      // update name
      if (nameValue !== undefined) {
        const namePath = [...basePath, "name"] as any[];
        const edits = modify(updated, namePath, nameValue, { formattingOptions: { insertSpaces: true, tabSize: 2 } });
        updated = applyEdits(updated, edits);
      }

      // update color
      if (colorValue !== undefined) {
        const colorPath = [...basePath, "color"] as any[];
        const edits = modify(updated, colorPath, colorValue, { formattingOptions: { insertSpaces: true, tabSize: 2 } });
        updated = applyEdits(updated, edits);
      }

      // persist the change to store which will re-generate graph
      // update editor contents so left-side text reflects change
      try {
        // update the file contents (left editor) first so UI updates immediately
        setContents({ contents: updated, hasChanges: true, skipUpdate: true });
      } catch (e) {
        // ignore
      }

      setJson(updated);

      // close editor
      setIsEditing(false);
      onClose?.();
    } catch (error) {
      // if modify fails, silently ignore for now
      console.error("Failed to update node:", error);
    }
  }, [nodeData, nameValue, colorValue, currentJson, setJson, setContents, onClose]);

  const handleCancel = React.useCallback(() => {
    setIsEditing(false);
    // restore values from nodeData
    if (nodeData) {
      const nameRow = nodeData.text.find(r => r.key === "name");
      const colorRow = nodeData.text.find(r => r.key === "color");
      setNameValue(String(nameRow?.value ?? ""));
      setColorValue(String(colorRow?.value ?? ""));
    }
  }, [nodeData]);

  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <Group gap="xs">
              <Button size="xs" variant="outline" onClick={() => setIsEditing(v => !v)}>
                {isEditing ? "Close Editor" : "Edit"}
              </Button>
              <CloseButton onClick={onClose} />
            </Group>
          </Flex>

          {isEditing ? (
            <Stack>
              <Text fz="xs" fw={500}>
                Edit properties
              </Text>
              <TextInput label="name" value={nameValue} onChange={e => setNameValue(e.currentTarget.value)} />
              <TextInput
                label="color"
                value={colorValue}
                onChange={e => setColorValue(e.currentTarget.value)}
                placeholder="#FF0000"
              />
              <Group gap="xs">
                <Button size="xs" onClick={handleSave}>
                  Save
                </Button>
                <Button size="xs" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </Group>
            </Stack>
          ) : (
            <ScrollArea.Autosize mah={250} maw={600}>
              <CodeHighlight
                code={normalizeNodeData(nodeData?.text ?? [])}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
            </ScrollArea.Autosize>
          )}
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
      </Stack>
    </Modal>
  );
};
