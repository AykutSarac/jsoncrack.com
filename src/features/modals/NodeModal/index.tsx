import React, { useEffect, useState } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Button, Group, Textarea } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useFile from "../../../store/useFile";
import Editor, { type EditorProps, loader, type OnMount, useMonaco } from "@monaco-editor/react";

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
  if (opened) {
    const fresh = dataToString(selectedNode?.text);
    setEditValue(fresh);
    setEditing(false);
  }
}, [opened, selectedNode?.path]);
  const monaco = useMonaco();
  const contents = useFile(state => state.contents);
  const setContents = useFile(state => state.setContents);
  const json = useFile(state => state.fileData);
  const handleSave = () => {
  try {
    if (!editValue) {
      alert("Nothing to save!");
      return;
    }
    const newValue = JSON.parse(editValue);

    // Build a normalized path array, e.g. "fruits.1.nutrients" → ["fruits","1","nutrients"]
    const rawPath = Array.isArray(selectedNode?.path)
      ? selectedNode.path.join(".")
      : (selectedNode?.path || "").replace(/^{Root}\.?/, "");
    const pathArr = rawPath
      .split(".")
      .filter(Boolean);

    // Deep clone your original JSON
    const updatedJson = JSON.parse(JSON.stringify(json));

    // If root edit, just replace
    if (pathArr.length === 0) {
      setContents({ contents: JSON.stringify(newValue, null, 2) });
    } else {
      // Traverse down to the parent of the target
      let cursor: any = updatedJson;
      for (let i = 0; i < pathArr.length - 1; i++) {
        const key = pathArr[i];
        const nextKey = pathArr[i + 1];

        // Determine whether current is array-slot or object-prop
        const idx = Array.isArray(cursor) && !isNaN(Number(key))
          ? Number(key)
          : key;

        // Auto-create if missing (so you never hit `null`/`undefined`)
        if (cursor[idx] === undefined || cursor[idx] === null) {
          // if next is numeric, make an array, else an object
          cursor[idx] = !isNaN(Number(nextKey)) ? [] : {};
        }

        // Sanity check
        if (typeof cursor[idx] !== "object") {
          throw new Error(
            `Cannot traverse path "${pathArr
              .slice(0, i + 1)
              .join(".")}" — not an object/array`
          );
        }

        cursor = cursor[idx];
      }

      // And finally set the new value
      const lastKey = pathArr[pathArr.length - 1];
      const finalIdx = Array.isArray(cursor) && !isNaN(Number(lastKey))
        ? Number(lastKey)
        : lastKey;
      cursor[finalIdx] = newValue;

      // Persist the entire JSON back
      setContents({ contents: JSON.stringify(updatedJson, null, 2) });
    }

    setEditing(false);
    onClose();
  } catch (err: any) {
    console.error("Save error:", err);
    alert("Save failed:\n" + err.message);
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

