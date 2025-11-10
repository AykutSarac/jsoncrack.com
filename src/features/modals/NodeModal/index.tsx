import React, { useEffect, useState } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, CloseButton, Button, Flex, JsonInput } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import { contentToJson, jsonToContent } from "../../../lib/utils/jsonAdapter";
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
  const [nodeValue, setNodeValue] = useState<string>("");
  const [nodeType, setNodeType] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>("");
  const [getContents, setContents, getFormat] = useFile(state => [state.getContents, state.setContents, state.getFormat]);
  const [canEdit, setCanEdit] = useState(false);

  const handleEdit = () => {
    if (nodeType === "string") {
      setEditValue(`"${nodeValue}"`);
    } else {
      setEditValue(nodeValue);
    }

    setEditing(true);
  }

  const handleSave = async () => {
    let updatedNode;
    try {
      updatedNode = JSON.parse(editValue);
    } catch (_) {
      return;
    }

    const currentContents = getContents();
    let contentJson = await contentToJson(currentContents, getFormat());

    const segments = nodeData?.path ?? [];
    if (segments.length === 0) {
      contentJson = updatedNode;
    } else {
      let node = contentJson;
      for (let i = 0; i < segments.length - 1; ++i) {
        const segment = segments[i];
        node = node[segment];
      }

      node[segments[segments.length - 1]] = updatedNode;
    }

    const updatedContents = await jsonToContent(JSON.stringify(contentJson), getFormat());
    setContents({ contents: updatedContents, format: getFormat() });

    if (typeof contentJson === "string") {
      setNodeValue(editValue.substring(1, editValue.length - 1));
    } else {
      setNodeValue(editValue);
    }
    setNodeType(typeof contentJson);

    setEditing(false);
  }

  const handleCancel = () => {
    setEditing(false);
  }

  useEffect(() => {
    const normalizedData = normalizeNodeData(nodeData?.text ?? []);
    setNodeValue(normalizedData);
    setNodeType(nodeData?.["parentType"] ?? "");
    setCanEdit(!(nodeData?.text.some(t => (t.type === "array" || t.type === "object")) ?? true));
  }, [nodeData]);

  useEffect(() => {
    if (opened) return;

    setEditing(false);
  }, [opened]);

  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <Flex gap="sm" align="center">
              {canEdit &&
              <>
              {editing ?
              <>
                <Button variant="filled" color="green" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="filled" color="gray" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
              :
              <Button variant="light" onClick={handleEdit}>
                Edit
              </Button>
              }
              </>
              }
              <CloseButton onClick={onClose} />
            </Flex>
          </Flex>
          <ScrollArea.Autosize mah={250} maw={600}>
            {editing ?
            <JsonInput
              value={editValue}
              onChange={setEditValue}
              validationError="Invalid JSON"
              formatOnBlur
              miw={350}
              maw={600}
              autosize
            />
            :
            <CodeHighlight
              code={nodeValue}
              miw={350}
              maw={600}
              language="json"
              withCopyButton
            />
            }
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
