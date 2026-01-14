import React from "react";
import type { ModalProps } from "@mantine/core";
import {
  Modal,
  Stack,
  Text,
  ScrollArea,
  Flex,
  CloseButton,
  TextInput,
  Group,
  Button,
  Alert,
} from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useFile from "../../../store/useFile";
import type { JSONPath } from "jsonc-parser";

const getValueAtPath = (source: string, path?: JSONPath): unknown => {
  let root: any;
  try { root = JSON.parse(source); } catch { return undefined; }
  if (!path || path.length === 0) return root;
  return path.reduce((acc: any, seg) => (acc == null ? undefined : acc[seg as any]), root);
};

const isPrimitive = (v: unknown) =>
  v === null || (typeof v !== "object" && typeof v !== "function");

const buildPrimitiveSubset = (nodeVal: unknown): Record<string, unknown> => {
  if (nodeVal && typeof nodeVal === "object" && !Array.isArray(nodeVal)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(nodeVal as Record<string, unknown>)) {
      if (isPrimitive(v)) out[k] = v;
    }
    return out;
  }
  if (isPrimitive(nodeVal)) return { value: nodeVal as unknown };
  return {};
};

const toDisplayString = (v: unknown) =>
  typeof v === "string" ? v : JSON.stringify(v);

const isNumericLiteral = (s: string) =>
  /^\s*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?\s*$/.test(s);

const parseFieldValue = (_original: unknown, text: string): unknown => {
  const t = text.trim();
  if (isNumericLiteral(t)) return Number(t);
  try {
    return JSON.parse(t);
  } catch {
    return text;
  }
};

const jsonPathToString = (path?: NodeData["path"]) => {
  if (!path || path.length === 0) return "$";
  const segments = path.map(seg => (typeof seg === "number" ? seg : `"${seg}"`));
  return `$[${segments.join("][")}]`;
};

const pretty = (val: unknown) => {
  try { return JSON.stringify(val, null, 2); } catch { return "{}"; }
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(s => s.selectedNode);
  const contents = useFile(s => s.contents);
  const applyNodeEdit = useFile(s => s.applyNodeEdit);

  const currentValue = React.useMemo(
    () => getValueAtPath(contents, nodeData?.path),
    [contents, nodeData?.path]
  );

  const primitiveSubset = React.useMemo(
    () => buildPrimitiveSubset(currentValue),
    [currentValue]
  );

  const [form, setForm] = React.useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const next: Record<string, string> = {};
    Object.entries(primitiveSubset).forEach(([k, v]) => {
      next[k] = toDisplayString(v);
    });
    setForm(next);
    setIsEditing(false);
    setError(null);
  }, [nodeData?.id, primitiveSubset]);

  const onEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const onCancel = () => {
    const reset: Record<string, string> = {};
    Object.entries(primitiveSubset).forEach(([k, v]) => {
      reset[k] = toDisplayString(v);
    });
    setForm(reset);
    setIsEditing(false);
    setError(null);
  };

  const onSave = () => {
    if (!nodeData?.path) {
      setError("Cannot locate JSON path of this node.");
      return;
    }

    let base: any = {};
    if (currentValue && typeof currentValue === "object" && !Array.isArray(currentValue)) {
      base = { ...(currentValue as any) };
    }

    for (const [k, originalVal] of Object.entries(primitiveSubset)) {
      const typedVal = parseFieldValue(originalVal, form[k] ?? "");
      base[k] = typedVal;
    }

    try {
      applyNodeEdit(nodeData.path, base);
      setIsEditing(false);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Failed to save changes.");
    }
  };

  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>Content</Text>
            <Group gap="xs">
              {!isEditing ? (
                <Button size="xs" onClick={onEdit} aria-label="Edit">Edit</Button>
              ) : (
                <>
                  <Button size="xs" variant="default" onClick={onCancel} aria-label="Cancel">
                    Cancel
                  </Button>
                  <Button size="xs" color="green" onClick={onSave} aria-label="Save">
                    Save
                  </Button>
                </>
              )}
              <CloseButton onClick={onClose} />
            </Group>
          </Flex>

          {!isEditing ? (
            <ScrollArea.Autosize mah={250} maw={600}>
              <CodeHighlight
                code={pretty(primitiveSubset)}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
            </ScrollArea.Autosize>
          ) : (
            <>
              <Stack gap="sm">
                {Object.keys(primitiveSubset).length === 0 && (
                  <Alert color="yellow" title="Nothing to edit">
                    This node has no direct values. (All fields are objects/arrays.)
                  </Alert>
                )}
                {Object.entries(primitiveSubset).map(([k, originalVal]) => (
                  <TextInput
                    key={k}
                    label={k}
                    value={form[k] ?? ""}
                    placeholder={
                      typeof originalVal === "string"
                        ? "text"
                        : "JSON literal (e.g., 42, true, null)"
                    }
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [k]: e.currentTarget.value }))
                    }
                  />
                ))}
              </Stack>
              {error && <Alert color="red" title="Error">{error}</Alert>}
            </>
          )}
        </Stack>

        <Text fz="xs" fw={500}>JSON Path</Text>
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

export default NodeModal;

