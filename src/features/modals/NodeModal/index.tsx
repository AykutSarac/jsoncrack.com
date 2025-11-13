import React from "react";
import type { ModalProps } from "@mantine/core";
import {
  Modal,
  Stack,
  Text,
  ScrollArea,
  Flex,
  CloseButton,
  Button,
  Textarea,
  Group,
} from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import toast from "react-hot-toast";
import { FiEdit, FiSave, FiX } from "react-icons/fi";
import useFile from "../../../store/useFile";
import useJson from "../../../store/useJson";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";

// return object from json removing array and object fields
const normalizeNodeData = (nodeRows: NodeData["text"]) => {
  // return valid JSON string for editing/viewing
  if (!nodeRows || nodeRows.length === 0) return "{}";

  // single primitive value (like string/number/null)
  if (nodeRows.length === 1 && !nodeRows[0].key) {
    const v = nodeRows[0].value;
    // ensure strings are quoted
    if (typeof v === "string") return JSON.stringify(v);
    return JSON.stringify(v, null, 2);
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
  const getContents = useFile(state => state.getContents);
  const setContents = useFile(state => state.setContents);
  const setJson = useJson(state => state.setJson);

  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!editing) setError(null);
  }, [editing]);

  const startEditing = () => {
    const str = normalizeNodeData(nodeData?.text ?? []);
    setDraft(str);
    setEditing(true);
  };

  const setAtPath = (obj: any, path: NodeData["path"] | undefined, value: any) => {
    if (!path || path.length === 0) return value; // replace root

    // clone path traversal
    const cloned = Array.isArray(obj) ? [...obj] : { ...obj };
    let target: any = cloned;
    for (let i = 0; i < path.length - 1; i++) {
      const seg = path[i] as string | number;
      if (typeof seg === "number") {
        target[seg] = Array.isArray(target[seg]) ? [...target[seg]] : target[seg];
      } else {
        target[seg] = target[seg] && typeof target[seg] === "object" ? { ...target[seg] } : {};
      }
      target = target[seg];
    }
    const last = path[path.length - 1] as string | number;
    target[last as any] = value;
    return cloned;
  };

  const handleSave = async () => {
    try {
      // ensure draft is valid JSON
      const newVal = JSON.parse(draft);

      const contents = getContents();
      const json = JSON.parse(contents);

      const updated = setAtPath(json, nodeData?.path, newVal);

      const out = JSON.stringify(updated, null, 2);

      // update editor contents and graph immediately
      await setContents({ contents: out, hasChanges: true });
      setJson(out);

      // Attempt to preserve selection: find the corresponding node in the rebuilt graph
      try {
        const targetPath = JSON.stringify(nodeData?.path ?? []);
        const nodes = useGraph.getState().nodes;
        const found = nodes.find(n => JSON.stringify(n.path ?? []) === targetPath);
        if (found) {
          useGraph.getState().setSelectedNode(found);
        }
      } catch (e) {
        // non-fatal, ignore
      }

      toast.success("Saved");

      setEditing(false);
      onClose?.();
    } catch (err: any) {
      setError(err?.message ?? "Invalid JSON");
      toast.error(err?.message ?? "Invalid JSON");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setDraft("");
    setError(null);
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
              {!editing && (
                <Button size="xs" variant="subtle" onClick={startEditing}>
                  <FiEdit style={{ marginRight: 8 }} />
                  Edit
                </Button>
              )}
              {editing && (
                <>
                  <Button size="xs" color="green" onClick={handleSave}>
                    <FiSave style={{ marginRight: 8 }} />
                    Save
                  </Button>
                  <Button size="xs" color="gray" onClick={handleCancel}>
                    <FiX style={{ marginRight: 8 }} />
                    Cancel
                  </Button>
                </>
              )}
              <CloseButton onClick={onClose} />
            </Group>
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
              <Textarea
                value={draft}
                onChange={e => setDraft(e.currentTarget.value)}
                autosize
                minRows={4}
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
        {error && (
          <Text fz="xs" color="red">
            {error}
          </Text>
        )}
      </Stack>
    </Modal>
  );
};
