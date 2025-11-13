// src/features/modals/NodeModal/index.tsx
import React, { useEffect, useState } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, Textarea } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import useFile from "../../../store/useFile";
import useJson from "../../../store/useJson";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";

// return object from json removing array and object fields
const normalizeNodeData = (nodeRows: NodeData["text"]) => {
  if (!nodeRows || nodeRows.length === 0) return "{}";
  if (nodeRows.length === 1 && !nodeRows[0].key) return `${nodeRows[0].value}`;

  const obj: Record<string, unknown> = {};
  nodeRows?.forEach(row => {
    if (row.type !== "array" && row.type !== "object") {
      if (row.key) (obj as any)[row.key] = row.value;
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

const setAtPath = (root: any, path: NodeData["path"] | undefined, value: any) => {
  if (!path || path.length === 0) return value;
  // deep clone root to avoid mutation
  const base = root ?? (typeof path[0] === "number" ? [] : {});
  const clone = Array.isArray(base) ? [...base] : { ...base };
  let cur: any = clone;

  for (let i = 0; i < path.length - 1; i += 1) {
    const seg = path[i];
    const nextSeg = path[i + 1];
    const nextIsIndex = typeof nextSeg === "number";

    if (typeof seg === "number") {
      if (cur[seg] == null || typeof cur[seg] !== "object") {
        cur[seg] = nextIsIndex ? [] : {};
      }
      cur = cur[seg];
    } else {
      if (cur[seg] == null || typeof cur[seg] !== "object") {
        cur[seg] = nextIsIndex ? [] : {};
      }
      cur = cur[seg];
    }
  }

  const last = path[path.length - 1]!;
  cur[last as any] = value;
  return clone;
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);
  const json = useJson(state => state.json);
  const setJson = useJson(state => state.setJson);
  const setContents = useFile(state => state.setContents);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // reset draft when selected node changes or modal opens
    if (opened) {
      setIsEditing(false);
      setError(null);
      setDraft(normalizeNodeData(nodeData?.text ?? []));
    }
  }, [nodeData, opened]);

  const onStartEdit = () => {
    setError(null);
    setDraft(normalizeNodeData(nodeData?.text ?? []));
    setIsEditing(true);
  };

  const onCancel = () => {
    setError(null);
    setDraft(normalizeNodeData(nodeData?.text ?? []));
    setIsEditing(false);
  };

  const onSave = () => {
    setError(null);

    let parsed: unknown = draft;
    const trimmed = draft.trim();
    const looksLikeJson = trimmed.startsWith("{") || trimmed.startsWith("[") || trimmed === "null";

    if (looksLikeJson) {
      try {
        parsed = JSON.parse(draft);
      } catch (e) {
        setError("Invalid JSON: " + (e as Error).message);
        return;
      }
    }

    if (typeof setJson !== "function") {
      setError("JSON setter not available");
      return;
    }

    try {
      let root: any;
      if (typeof json === "string" && json.trim() !== "") {
        try {
          root = JSON.parse(json);
        } catch {
          setError("Failed to parse current JSON");
          return;
        }
      } else if (typeof json === "object" && json != null) {
        root = JSON.parse(JSON.stringify(json));
      } else {
        root = {};
      }

      const updatedRoot = setAtPath(root, nodeData?.path, looksLikeJson ? parsed : draft);
      const nextJsonString = JSON.stringify(updatedRoot, null, 2);

      setJson(nextJsonString);

      if (typeof setContents === "function") {
        setContents({ contents: nextJsonString, hasChanges: true, skipUpdate: true });
      }

      setIsEditing(false);
    } catch (e) {
      setError("Failed to update JSON");
    }
  };

  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <Flex gap="sm" align="center">
              {!isEditing ? (
                <Button size="xs" variant="outline" onClick={onStartEdit}>
                  Edit
                </Button>
              ) : (
                <Flex gap="xs" align="center">
                  <Button size="xs" color="green" onClick={onSave}>
                    Save
                  </Button>
                  <Button size="xs" variant="subtle" onClick={onCancel}>
                    Cancel
                  </Button>
                </Flex>
              )}
              <CloseButton onClick={onClose} />
            </Flex>
          </Flex>

          {!isEditing ? (
            <ScrollArea.Autosize mah={250} maw={600}>
              <CodeHighlight
                code={normalizeNodeData(nodeData?.text ?? [])}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
            </ScrollArea.Autosize>
          ) : (
            <>
              <Textarea
                minRows={6}
                maxRows={14}
                value={draft}
                onChange={e => setDraft(e.currentTarget.value)}
                autosize
                maw={600}
                miw={350}
              />
              {error && (
                <Text color="red" fz="xs">
                  {error}
                </Text>
              )}
            </>
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
