import React, { useState, useEffect } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, Textarea, Group } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";

const normalizeNodeData = (nodeRows: NodeData["text"]) => {
  if (!nodeRows || nodeRows.length === 0) return "{}";
  if (nodeRows.length === 1 && !nodeRows[0].key) return `${nodeRows[0].value}`;

  const obj: Record<string, any> = {};
  nodeRows?.forEach(row => {
    if (row.type !== "array" && row.type !== "object") {
      if (row.key) obj[row.key] = row.value;
    }
  });
  return JSON.stringify(obj, null, 2);
};

const jsonPathToString = (path?: NodeData["path"]) => {
  if (!path || path.length === 0) return "$";
  const segments = path.map(seg => (typeof seg === "number" ? seg : `"${seg}"`));
  return `$[${segments.join("][")}]`;
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);

  // local state to control edit modal
  const [editOpened, setEditOpened] = useState(false);
  const [editValue, setEditValue] = useState<string>("{}");
  const [error, setError] = useState<string | null>(null);

  // populate editor whenever selected node changes / modal opens
  useEffect(() => {
    setEditValue(normalizeNodeData(nodeData?.text ?? []));
    setError(null);
  }, [nodeData, opened]);

  const handleOpenEdit = () => {
    setEditValue(normalizeNodeData(nodeData?.text ?? []));
    setError(null);
    setEditOpened(true);
  };

  const handleSaveEdit = () => {
    try {
      const parsed = JSON.parse(editValue);

      const store: any = (useGraph as any).getState ? (useGraph as any).getState() : null;
      if (!store) {
        setError("Save failed: graph store unavailable.");
        return;
      }

      // prefer patch updater so only edited fields are applied
      if (typeof store.updateSelectedNodePatch === "function") {
        store.updateSelectedNodePatch(parsed);
      } else if (typeof store.updateNodePatch === "function" && nodeData?.id !== undefined) {
        store.updateNodePatch(nodeData.id, parsed);
      } else {
        // fallback: merge in modal and call existing full-replace updater (keeps unedited fields)
        const nodeRowsToObject = (rows: NodeData["text"]) => {
          if (!rows || rows.length === 0) return {};
          if (rows.length === 1 && !rows[0].key) return rows[0].value;
          const out: Record<string, any> = {};
          rows.forEach(r => { if (r.key) out[r.key] = r.value; });
          return out;
        };
        const deepMerge = (base: any, patch: any): any => {
          if (base == null || typeof base !== "object" || Array.isArray(base)) return patch;
          if (patch == null || typeof patch !== "object" || Array.isArray(patch)) return patch;
          const out = { ...base };
          for (const k of Object.keys(patch)) out[k] = deepMerge(base[k], patch[k]);
          return out;
        };

        const existing = nodeRowsToObject(nodeData?.text ?? []);
        const merged = deepMerge(existing, parsed);

        if (typeof store.updateSelectedNodeContent === "function") {
          store.updateSelectedNodeContent(merged);
        } else if (typeof store.updateNode === "function" && nodeData?.id !== undefined) {
          store.updateNode(nodeData.id, merged);
        } else {
          setError("Save failed: no updater found in graph store.");
          return;
        }
      }

      setEditOpened(false);
      onClose?.();
    } catch (e) {
      setError("Invalid JSON: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  return (
    <>
      <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
        <Stack pb="sm" gap="sm">
          <Stack gap="xs">
            <Flex justify="space-between" align="center">
              <Text fz="xs" fw={500}>
                Content
              </Text>
              <Group gap="xs">
                <Button size="xs" variant="outline" onClick={handleOpenEdit}>
                  Edit
                </Button>
                <CloseButton onClick={onClose} />
              </Group>
            </Flex>
            <ScrollArea.Autosize mah={250} maw={600}>
              <CodeHighlight
                code={normalizeNodeData(nodeData?.text ?? [])}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
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

      {/* Edit modal */}
      <Modal opened={editOpened} onClose={() => setEditOpened(false)} title="Edit node content" centered>
        <Stack>
          <Textarea
            value={editValue}
            onChange={(e) => {
              setEditValue(e.currentTarget.value);
              setError(null);
            }}
            autosize
            styles={{ input: { fontFamily: "monospace", fontSize: 13 } }}
          />
          {error && (
            <Text fz="xs" color="red">
              {error}
            </Text>
          )}

          {/* JSON */}
          <Text fz="xs" fw={500}>
            JSON Path
          </Text>
          <ScrollArea.Autosize mah={120} maw={700}>
            <CodeHighlight
              code={jsonPathToString(nodeData?.path)}
              miw={350}
              language="json"
              copyLabel="Copy JSON Path"
              copiedLabel="Copied"
              withCopyButton
            />
          </ScrollArea.Autosize>
          <Flex justify="flex-end" gap="xs">
            <Button variant="default" onClick={() => setEditOpened(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
};
