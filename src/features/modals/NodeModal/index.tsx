import React from "react";
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

  // singular primitive value (string/number/boolean/null)
  if (nodeRows.length === 1 && !nodeRows[0].key) {
    // Use JSON.stringify so strings are quoted and values are valid JSON for editing
    return JSON.stringify(nodeRows[0].value, null, 2);
  }

  const obj: Record<string, unknown> = {};
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
  const setJson = useJson(state => state.setJson);

  const [editing, setEditing] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState<string>("{}");

  // keep edited content in sync when node changes
  React.useEffect(() => {
    setEditing(false);
    setEditedContent(normalizeNodeData(nodeData?.text ?? []));
  }, [nodeData]);

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setEditedContent(normalizeNodeData(nodeData?.text ?? []));
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      const json = useJson.getState().json;
      const path = nodeData?.path ?? [];

      // parse edited content into a JS value using jsonc-parser
      const { parse, modify, applyEdits } = await import("jsonc-parser");
      const parsed = parse(editedContent);

      // jsonc-parser modify expects path as array of path segments
      const edits = modify(json, path as any, parsed, {
        formattingOptions: { insertSpaces: true, tabSize: 2 },
      });

      const updated = applyEdits(json, edits);
      setJson(updated);
      useFile.getState().setContents({ contents: updated, hasChanges: false, skipUpdate: true });
      // update the selected node reference so the CodeHighlight box reflects the new content
      try {
        const pathStr = JSON.stringify(path ?? []);
        const nodes = useGraph.getState().nodes;
        const found = nodes.find(n => JSON.stringify(n.path ?? []) === pathStr);
        if (found) {
          useGraph.getState().setSelectedNode(found);
        }
      } catch (e) {
        // ignore errors here; UI will still update from graph re-parse
      }
      setEditing(false);
    } catch (err) {
      // if parse or modify fails, just log for now; could show a toast in future
      // eslint-disable-next-line no-console
      console.error("Failed to save node edit", err);
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
            <CloseButton onClick={onClose} />
          </Flex>

          {!editing ? (
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
            <Textarea
              value={editedContent}
              onChange={e => setEditedContent(e.currentTarget.value)}
              minRows={6}
              maw={600}
              style={{ fontFamily: "monospace" }}
            />
          )}

          <Flex justify="flex-end">
            {!editing ? (
              <Button size="xs" variant="light" onClick={handleEdit}>
                Edit
              </Button>
            ) : (
              <>
                <Button size="xs" color="green" onClick={handleSave}>
                  Save
                </Button>
                <Button size="xs" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            )}
          </Flex>
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
