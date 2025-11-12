import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, TextInput, Group } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson";
import useFile from "../../../store/useFile";

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
  const getJson = useJson(state => state.getJson);
  const setContents = useFile(state => state.setContents);

  const [isEditing, setIsEditing] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!nodeData) return setValues({});
    const init: Record<string, string> = {};
    nodeData.text.forEach(r => {
      if (r.key && r.type !== "array" && r.type !== "object") {
        init[r.key] = r.value == null ? "" : String(r.value);
      }
    });
    setValues(init);
    setIsEditing(false);
  }, [nodeData, opened]);

  const handleChange = (key: string, value: string) => setValues(v => ({ ...v, [key]: value }));

  const getAtPath = (obj: any, path: Array<string | number>) => path.reduce((acc, seg) => (acc == null ? undefined : acc[seg as any]), obj);

  const setAtPath = (obj: any, path: Array<string | number>, value: any) => {
    if (!path || path.length === 0) return value;
    const last = path[path.length - 1];
    const parentPath = path.slice(0, -1);
    let parent = obj;
    for (const seg of parentPath) {
      if (parent[seg as any] == null) parent[seg as any] = typeof seg === "number" ? [] : {};
      parent = parent[seg as any];
    }
    parent[last as any] = value;
    return obj;
  };

  const coerceValue = (orig: any, newVal: string) => {
    if (orig === null) return newVal === "null" ? null : newVal;
    if (typeof orig === "number") {
      const n = Number(newVal);
      return Number.isNaN(n) ? newVal : n;
    }
    if (typeof orig === "boolean") return newVal === "true";
    return newVal;
  };

  const handleSave = () => {
    if (!nodeData) return;
    try {
      const jsonStr = getJson();
      const parsed = JSON.parse(jsonStr);

      Object.keys(values).forEach(key => {
        const newValStr = values[key];
        const fullPath = [...(nodeData.path ?? []), key] as Array<string | number>;
        const orig = getAtPath(parsed, fullPath);
        const coerced = coerceValue(orig, newValStr);
        setAtPath(parsed, fullPath, coerced);
      });

      setContents({ contents: JSON.stringify(parsed, null, 2) });
      setIsEditing(false);
      onClose?.();
    } catch (err) {
      console.error("Failed to save node edits", err);
    }
  };

  const handleCancel = () => {
    if (!nodeData) return setValues({});
    const init: Record<string, string> = {};
    nodeData.text.forEach(r => {
      if (r.key && r.type !== "array" && r.type !== "object") {
        init[r.key] = r.value == null ? "" : String(r.value);
      }
    });
    setValues(init);
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
            <Group>
              {!isEditing ? (
                <Button color="blue" size="xs" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              ) : (
                <>
                  <Button color="green" size="xs" onClick={handleSave}>
                    Save
                  </Button>
                  <Button color="red" size="xs" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              )}
              <CloseButton onClick={onClose} />
            </Group>
          </Flex>

          {isEditing ? (
            <Stack gap="md">
              {nodeData?.text
                .filter(r => r.key && r.type !== "array" && r.type !== "object")
                .map((row, idx) => (
                  <Stack gap="xs" key={String(row.key) + idx}>
                    <Text fz="xs" fw={500}>
                      {row.key}
                    </Text>
                    <TextInput
                      value={values[row.key ?? ""] ?? ""}
                      onChange={e => handleChange(row.key ?? "", e.currentTarget.value)}
                    />
                  </Stack>
                ))}
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
