import React, { useState, useMemo } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, TextInput, Group } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson";

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

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  // prepare initial fields when modal opens / nodeData changes
  React.useEffect(() => {
    setEditing(false);
    // prefer explicit 'name' and 'color' rows when available
    const nameRow = nodeData?.text?.find(r => r.key === "name");
    const colorRow = nodeData?.text?.find(r => r.key === "color");

    if (nameRow) {
      setName(nameRow.value !== undefined ? String(nameRow.value) : "");
    } else {
      // fallback: use first primitive row value
      const first = nodeData?.text?.find(r => r.key !== null);
      setName(first?.value !== undefined ? String(first.value) : "");
    }

    if (colorRow) {
      setValue(colorRow.value !== undefined ? String(colorRow.value) : "");
    } else {
      // fallback: if node itself is a single primitive, use that
      const single = nodeData?.text?.[0];
      setValue(single?.value !== undefined ? String(single.value) : "");
    }
  }, [nodeData]);

  const pathForKey = (key: string | undefined) => {
    if (!nodeData) return undefined;
    // if node has the key as a row, target that; otherwise target parent path and key
    const row = nodeData.text?.find(r => r.key === key);
    if (row && key) return nodeData.path ? [...nodeData.path, key] : [key];
    if (nodeData.path) return [...nodeData.path, key ?? ""]; // create
    return key ? [key] : undefined;
  };

  const handleSave = () => {
    if (!nodeData) return;
    try {
      // handle renaming a key named 'name' (rare) - we don't rename arbitrary keys here
      // set name value
      const namePath = pathForKey("name");
      if (namePath) {
        let parsedName: any = name;
        try {
          parsedName = JSON.parse(name);
        } catch (e) {
          parsedName = name;
        }
        useJson.getState().setValueAtPath(namePath, parsedName);
      }

      // set color/value
      const colorPath = pathForKey("color");
      if (colorPath) {
        let parsedColor: any = value;
        try {
          parsedColor = JSON.parse(value);
        } catch (e) {
          parsedColor = value;
        }
        useJson.getState().setValueAtPath(colorPath, parsedColor);
      }

      setEditing(false);
      onClose();
    } catch (err) {
      console.warn("Failed to save node edits", err);
    }
  };

  const handleCancel = () => {
    // discard local changes
    const first = nodeData?.text?.[0];
    setName(first?.key ?? "");
    setValue(first?.value !== undefined ? String(first.value) : "");
    setEditing(false);
  };

  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <Flex gap="xs" align="center">
              {!editing ? (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setEditing(true)}
                  data-testid="node-edit-button"
                >
                  Edit
                </Button>
              ) : (
                <Group spacing={6}>
                  <Button size="xs" color="green" onClick={handleSave} data-testid="node-save-button">
                    Save
                  </Button>
                  <Button size="xs" variant="outline" color="red" onClick={handleCancel} data-testid="node-cancel-button">
                    Cancel
                  </Button>
                </Group>
              )}
              <CloseButton onClick={onClose} />
            </Flex>
          </Flex>
          <ScrollArea.Autosize mah={250} maw={600}>
            {!editing ? (
              <CodeHighlight
                code={normalizeNodeData(nodeData?.text ?? [])}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
            ) : (
              <Stack spacing={8}>
                {/* Name input (only when key exists) */}
                {nodeData?.text?.[0]?.key ? (
                  <TextInput label="Name" size="xs" value={name} onChange={e => setName(e.currentTarget.value)} />
                ) : null}
                <TextInput label="Value / Color" size="xs" value={value} onChange={e => setValue(e.currentTarget.value)} />
              </Stack>
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
      </Stack>
    </Modal>
  );
};
