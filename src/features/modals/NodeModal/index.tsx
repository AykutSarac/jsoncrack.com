import React, { useState, useEffect } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, TextInput } from "@mantine/core";
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
  const [isEditing, setIsEditing] = useState(false);

  // Local editable fields (name and color). We'll seed them from the node's
  // JSON rows when available (look for keys 'name' and 'color'). Persisting
  // changes to the store/graph is out of scope for now; we keep them locally.
  const [savedName, setSavedName] = useState<string>("");
  const [savedColor, setSavedColor] = useState<string>("");
  const [nameValue, setNameValue] = useState<string>("");
  const [colorValue, setColorValue] = useState<string>("");

  // helper to get the string value of a node row by key
  const getRowValue = (key: string) => {
    const row = nodeData?.text?.find(r => r.key === key);
    if (!row || row.value == null) return "";
    return String(row.value);
  };

  // initialize saved values from nodeData when node changes
  useEffect(() => {
    setSavedName(getRowValue("name"));
    setSavedColor(getRowValue("color"));
    // reset editing inputs
    setNameValue("");
    setColorValue("");
    setIsEditing(false);
  }, [nodeData]);

  const handleEdit = () => {
    // seed inputs from saved values (or directly from node data if saved empty)
    setNameValue(savedName || getRowValue("name"));
    setColorValue(savedColor || getRowValue("color"));
    setIsEditing(true);
  };

  const handleSave = () => {
    // Persist the edited name/color into the underlying JSON content.
    try {
      const currentJson = useJson.getState().getJson();

      const basePath = nodeData?.path ?? [];

      // apply name edit
      const namePath = [...basePath, "name"] as any[];
      const nameEdits = modify(currentJson, namePath, nameValue, {
        formattingOptions: { insertSpaces: true, tabSize: 2 },
      });
      const jsonAfterName = applyEdits(currentJson, nameEdits);

      // apply color edit on the result of name edit
      const colorPath = [...basePath, "color"] as any[];
      const colorEdits = modify(jsonAfterName, colorPath, colorValue, {
        formattingOptions: { insertSpaces: true, tabSize: 2 },
      });
      const jsonAfterColor = applyEdits(jsonAfterName, colorEdits);


  // update the global JSON store which will reparse the graph
  useJson.getState().setJson(jsonAfterColor);

  // also update the left raw JSON editor contents so the change appears immediately
  // set skipUpdate true to avoid triggering the debounced write-back to useJson
  useFile.getState().setContents({ contents: jsonAfterColor, hasChanges: false, skipUpdate: true });

      // Immediately refresh selectedNode in the graph store so the modal
      // reflects changes without needing to close/reopen. Find the new node
      // by matching path (basePath) and set it as selected.
      const refreshedNodes = useGraph.getState().nodes;
      const basePathArr = basePath ?? [];
      const matchNode = refreshedNodes.find(n => JSON.stringify(n.path ?? []) === JSON.stringify(basePathArr));
      if (matchNode) {
        useGraph.getState().setSelectedNode(matchNode);
      }

      // update local saved values and close edit mode
      setSavedName(nameValue);
      setSavedColor(colorValue);
      setIsEditing(false);
    } catch (error) {
      // fallback: just update local saved values
      setSavedName(nameValue);
      setSavedColor(colorValue);
      setIsEditing(false);
      console.error("Failed to persist node edits:", error);
    }
  };

  const handleCancel = () => {
    // discard edits and go back to view mode
    setNameValue(savedName || getRowValue("name"));
    setColorValue(savedColor || getRowValue("color"));
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
            <Flex align="center" gap="xs">
              {!isEditing && (
                <Button color="blue" size="xs" onClick={handleEdit}>
                  Edit
                </Button>
              )}

              {isEditing && (
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
            </Flex>
          </Flex>
          <ScrollArea.Autosize mah={250} maw={600}>
            {!isEditing ? (
              <CodeHighlight
                code={normalizeNodeData(nodeData?.text ?? [])}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
              ) : (
              <Stack gap="xs">
                <TextInput
                  label="name"
                  value={nameValue}
                  onChange={e => setNameValue(e.currentTarget.value)}
                  size="sm"
                />
                <TextInput
                  label="color"
                  value={colorValue}
                  onChange={e => setColorValue(e.currentTarget.value)}
                  size="sm"
                />
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
