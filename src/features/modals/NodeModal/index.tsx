import React from "react";
import type { ModalProps } from "@mantine/core";
import {
  Button,
  CloseButton,
  Flex,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { JSONPath } from "jsonc-parser";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson";
import useFile from "../../../store/useFile";
import { jsonToContent } from "../../../lib/utils/jsonAdapter";
import { updateJsonAtPath } from "../../../lib/utils/updateJsonAtPath";

const jsonPathToString = (path?: NodeData["path"]) => {
  if (!path || path.length === 0) return "$";
  const segments = path.map(seg => (typeof seg === "number" ? seg : `"${seg}"`));
  return `$[${segments.join("][")}]`;
};

const getValueAtPath = (json: string, path: JSONPath | undefined) => {
  try {
    const data = JSON.parse(json);
    const targetPath = Array.isArray(path) ? path : [];
    return targetPath.reduce<unknown>((acc, key) => {
      if (acc === undefined || acc === null) return undefined;
      if (typeof key === "number" && Array.isArray(acc)) return acc[key];
      if (typeof key === "string" && typeof acc === "object" && acc !== null) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, data as unknown);
  } catch (error) {
    console.warn("Failed to resolve node path", error);
    return undefined;
  }
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);
  const json = useJson(state => state.json);
  const setJson = useJson(state => state.setJson);
  const format = useFile(state => state.format);

  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const currentValue = React.useMemo(() => {
    const value = getValueAtPath(json, nodeData?.path);
    if (value === undefined && nodeData?.text) {
      const fallback = nodeData.text.reduce<Record<string, unknown>>((acc, row) => {
        if (row.key && row.type !== "object" && row.type !== "array") {
          acc[row.key] = row.value;
        }
        return acc;
      }, {});

      if (Object.keys(fallback).length > 0) return fallback;
    }

    return value ?? null;
  }, [json, nodeData?.path, nodeData?.text]);

  const serializedValue = React.useMemo(() => {
    try {
      return JSON.stringify(currentValue, null, 2);
    } catch {
      return "";
    }
  }, [currentValue]);

  const hasChanges = draft !== serializedValue;

  React.useEffect(() => {
    if (opened) {
      setError(null);
      setIsEditing(false);
      setDraft(serializedValue);
    }
  }, [opened, serializedValue]);

  const handleCancel = React.useCallback(() => {
    setDraft(serializedValue);
    setError(null);
    setIsEditing(false);
  }, [serializedValue]);

  const handleSave = React.useCallback(async () => {
    if (!nodeData) return;

    setIsSaving(true);
    setError(null);

    try {
      const parsedValue = JSON.parse(draft);
      const updatedJson = updateJsonAtPath(json, nodeData.path, parsedValue);
      const updatedContents = await jsonToContent(updatedJson, format);

      setJson(updatedJson);
      useFile.setState({ contents: updatedContents, hasChanges: true, error: null });

      if (typeof window !== "undefined") {
        sessionStorage.setItem("content", updatedContents);
        sessionStorage.setItem("format", format);
      }

      setIsEditing(false);
    } catch (err) {
      const message =
        err instanceof SyntaxError
          ? "Invalid JSON value. Use a valid JSON snippet such as \"text\", 42, true, or {...}."
          : err instanceof Error
            ? err.message
            : "Failed to update node value";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }, [draft, format, json, nodeData, setJson]);

  const canEdit = nodeData?.path !== undefined;

  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <Group gap="xs">
              {isEditing ? (
                <>
                  <Button
                    size="xs"
                    color="green"
                    onClick={handleSave}
                    loading={isSaving}
                    disabled={!draft.trim() || !hasChanges}
                  >
                    Save
                  </Button>
                  <Button size="xs" variant="subtle" color="gray" onClick={handleCancel} disabled={isSaving}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="xs" variant="outline" onClick={() => setIsEditing(true)} disabled={!canEdit}>
                  Edit
                </Button>
              )}
              <CloseButton onClick={onClose} />
            </Group>
          </Flex>
          {isEditing ? (
            <Textarea
              value={draft}
              onChange={event => setDraft(event.currentTarget.value)}
              styles={{ input: { fontFamily: "monospace" } }}
              autosize
              minRows={8}
              maw={600}
            />
          ) : (
            <ScrollArea.Autosize mah={250} maw={600}>
              <CodeHighlight
                code={serializedValue ?? ""}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
            </ScrollArea.Autosize>
          )}
          {error && (
            <Text fz="xs" c="red.5">
              {error}
            </Text>
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
