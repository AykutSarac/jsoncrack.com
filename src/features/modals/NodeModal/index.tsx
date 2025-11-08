import React, { useState, useEffect } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, Group, Textarea } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson";
import useFile from "../../../store/useFile";
import { jsonToContent } from "../../../lib/utils/jsonAdapter";

// helper: is plain object
const isPlainObject = (v: any) => v && typeof v === "object" && !Array.isArray(v);

// helper: extract primitive fields from node rows
const getPrimitiveFields = (nodeRows: NodeData["text"]) => {
  const obj: Record<string, any> = {};
  nodeRows?.forEach(row => {
    if (!row.key) return;
    if (row.type !== "object" && row.type !== "array") {
      const v = row.value;
      if (typeof v === "string") {
        const trimmed = v.trim();
        if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
          obj[row.key] = Number(trimmed);
        } else if (trimmed === "true" || trimmed === "false") {
          obj[row.key] = trimmed === "true";
        } else {
          obj[row.key] = v;
        }
      } else {
        obj[row.key] = v;
      }
    }
  });
  return obj;
};

// return object/array from node rows removing array and object fields as needed
const normalizeNodeData = (nodeRows: NodeData["text"]) => {
  if (!nodeRows || nodeRows.length === 0) return "{}";

  // if single value with no key, return it directly
  if (nodeRows.length === 1 && !nodeRows[0].key) {
    return String(nodeRows[0].value);
  }

  // For all other cases, return only primitive fields
  const primitiveObj = getPrimitiveFields(nodeRows);
  return Object.keys(primitiveObj).length 
    ? JSON.stringify(primitiveObj, null, 2)
    : "{}";
};

// return json path in the format $["customer"]
const jsonPathToString = (path?: NodeData["path"]) => {
  if (!path || path.length === 0) return "$";
  const segments = path.map(seg => (typeof seg === "number" ? seg : `"${seg}"`));
  return `$[${segments.join("][")}]`;
};

// deep merge source into target (mutates target) — used elsewhere if needed
const deepMerge = (target: any, source: any) => {
  if (!isPlainObject(target) || !isPlainObject(source)) return source;
  Object.keys(source).forEach(key => {
    const sv = source[key];
    const tv = target[key];
    if (isPlainObject(sv) && isPlainObject(tv)) {
      deepMerge(tv, sv);
    } else {
      target[key] = sv;
    }
  });
  return target;
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const setJson = useJson(state => state.setJson);
  const setContents = useFile(state => state.setContents);
  const getFormat = useFile(state => state.getFormat);
  const setSelectedNode = useGraph(state => state.setSelectedNode);
  const getJson = useJson(state => state.getJson);

  // helper: build node text rows from a value (object / array / primitive)
  const buildTextFromValue = (value: any): NodeData["text"] => {
    if (value === null || value === undefined) {
      return [{ value: String(value), type: "null" as any }];
    }
    if (Array.isArray(value)) {
      // return indexed rows so array children can be edited individually
      return value.map((v, i) => ({
        key: String(i),
        value: typeof v === "object" ? JSON.stringify(v, null, 2) : String(v),
        type: Array.isArray(v) ? ("array" as any) : typeof v === "object" ? ("object" as any) : (typeof v as any),
      }));
    }
    if (typeof value === "object") {
      return Object.keys(value).map(key => {
        const v = value[key];
        return {
          key,
          value: typeof v === "object" ? JSON.stringify(v, null, 2) : String(v),
          type: Array.isArray(v) ? ("array" as any) : typeof v === "object" ? ("object" as any) : (typeof v as any),
        };
      });
    }
    return [{ value: String(value), type: (typeof value as any) }];
  };

  const refreshNodeData = () => {
    if (nodeData?.path) {
      const currentJson = JSON.parse(getJson());
      let current: any = currentJson;
      const path = nodeData.path;

      // Navigate to the node
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }

      const finalValue = current[path[path.length - 1]];

      // Update the node data to refresh the display
      setSelectedNode({
        ...nodeData,
        text: buildTextFromValue(finalValue),
      });
    }
  };

  const handleEdit = () => {
    // If node is a single primitive (no key), allow editing that value directly
    if (nodeData?.text?.length === 1 && !nodeData.text[0].key) {
      setEditValue(String(nodeData.text[0].value));
      setIsEditing(true);
      return;
    }

    // Get primitive fields (reuse the same function used in view mode)
    const primitiveObj = getPrimitiveFields(nodeData?.text ?? []);
    setEditValue(Object.keys(primitiveObj).length ? JSON.stringify(primitiveObj, null, 2) : "{}");
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (nodeData?.path) {
      try {
        // Get current JSON (string from store)
        const currentJson = JSON.parse(getJson());
        let current: any = currentJson;
        const path = nodeData.path;

        // Navigate to the parent of the target
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
        }

        const targetKey = path[path.length - 1];
        const existing = current[targetKey];

        // Parse edited value if possible
        let parsed: any;
        let parsedOk = false;
        try {
          parsed = JSON.parse(editValue);
          parsedOk = true;
        } catch {
          parsed = editValue;
        }

        // If target is an object: update only existing primitive keys (do not overwrite child objects/arrays, do not add new keys)
        if (existing !== undefined && isPlainObject(existing) && isPlainObject(parsed)) {
          Object.keys(parsed).forEach(k => {
            if (Object.prototype.hasOwnProperty.call(existing, k)) {
              const existingVal = existing[k];
              // only update if existing value is not object/array
              if (!isPlainObject(existingVal) && !Array.isArray(existingVal)) {
                existing[k] = parsed[k];
              }
              // otherwise skip — children remain unchanged
            }
            // skip keys that do not exist on existing object (do not create new branches)
          });
        } else if (existing !== undefined && Array.isArray(existing) && Array.isArray(parsed)) {
          // replace arrays if user edited an array directly
          current[targetKey] = parsed;
        } else {
          // otherwise set/replace value (either parsed JSON or primitive string)
          current[targetKey] = parsedOk ? parsed : parsed;
        }

        // Update visualization + editor content
        const newJsonString = JSON.stringify(currentJson, null, 2);
        setJson(newJsonString);

        const contents = await jsonToContent(newJsonString, getFormat());
        setContents({ contents });

        // Refresh displayed node data immediately
        refreshNodeData();
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to save changes:", error);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue("");
  };

  // Refresh node data when modal opens
  useEffect(() => {
    if (opened && nodeData) {
      refreshNodeData();
    }
  }, [opened, nodeData?.path]);

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
                <Button size="xs" onClick={handleEdit}>Edit</Button>
              ) : (
                <>
                  <Button size="xs" color="green" onClick={handleSave}>Save</Button>
                  <Button size="xs" color="red" onClick={handleCancel}>Cancel</Button>
                </>
              )}
              <CloseButton onClick={onClose} />
            </Group>
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
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.currentTarget.value)}
                minRows={4}
                maxRows={12}
                style={{ fontFamily: 'monospace' }}
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
      </Stack>
    </Modal>
  );
};
