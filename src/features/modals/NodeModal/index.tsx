import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, Textarea } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson";
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
  const setSelectedNode = useGraph(state => state.setSelectedNode);

  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(() => normalizeNodeData(nodeData?.text ?? []));

  // keep editValue in sync when nodeData changes
  React.useEffect(() => {
    setEditValue(normalizeNodeData(nodeData?.text ?? []));
    setIsEditing(false);
  }, [nodeData?.id]);

  const handleCancel = () => {
    setEditValue(normalizeNodeData(nodeData?.text ?? []));
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!nodeData) return setIsEditing(false);

    // Try to parse editValue as JSON. If it fails, treat it as a raw string value.
    let parsed: any;
    let parsedOk = true;
    try {
      parsed = JSON.parse(editValue);
    } catch (e) {
      parsedOk = false;
      parsed = editValue;
    }

    const getType = (val: any) => {
      if (val === null) return "null";
      if (Array.isArray(val)) return "array";
      if (typeof val === "object") return "object";
      if (typeof val === "string") return "string";
      if (typeof val === "number") return "number";
      if (typeof val === "boolean") return "boolean";
      return "string";
    };

    let newText: NodeData["text"] = [];

    if (parsedOk && typeof parsed === "object" && !Array.isArray(parsed)) {
      // object -> convert to NodeRow[]; ensure value is string|number|null
      newText = Object.keys(parsed).map(key => {
        const val = parsed[key];
        return {
          key,
          value: typeof val === "object" ? JSON.stringify(val) : (val as string | number | null),
          type: getType(val),
        };
      });
    } else if (parsedOk && Array.isArray(parsed)) {
      // array -> single row with array type and childrenCount; store value as stringified representation
      newText = [
        {
          key: null,
          value: JSON.stringify(parsed),
          type: "array",
          childrenCount: parsed.length,
        },
      ];
    } else {
      // primitive or unparsed string -> single value row
      newText = [
        {
          key: null,
          value: parsed,
          type: getType(parsed),
        },
      ];
    }

    const updatedNode: NodeData = {
      ...nodeData,
      text: newText,
    };

    // Persist change into the underlying JSON using node.path
    try {
      const currentJsonStr = useJson.getState().getJson();
      let currentJson: any = {};
      try {
        currentJson = JSON.parse(currentJsonStr);
      } catch (e) {
        // if parse fails, fallback to empty object
        currentJson = {};
      }

      const path = nodeData.path;

      if (!path || path.length === 0) {
        // merge top-level when editing root: shallow merge if both objects, otherwise replace
        let newJsonStr: string;
        if (typeof currentJson === "object" && !Array.isArray(currentJson) && typeof parsed === "object" && !Array.isArray(parsed)) {
          Object.keys(parsed).forEach(k => {
            currentJson[k] = parsed[k];
          });
          newJsonStr = JSON.stringify(currentJson, null, 2);
        } else {
          newJsonStr = JSON.stringify(parsed, null, 2);
        }
        // update editor contents (left panel) and persist json
        useFile.getState().setContents({ contents: newJsonStr, skipUpdate: true });
        useJson.getState().setJson(newJsonStr);
      } else {
        // walk to parent
        let targetParent: any = currentJson;
        for (let i = 0; i < path.length - 1; i++) {
          const seg = path[i] as string | number;
          if (typeof seg === "number") {
            if (!Array.isArray(targetParent)) targetParent = [];
            if (typeof targetParent[seg] === "undefined") targetParent[seg] = {};
            targetParent = targetParent[seg];
          } else {
            if (typeof targetParent[seg] === "undefined") targetParent[seg] = {};
            targetParent = targetParent[seg];
          }
        }

        const lastSeg = path[path.length - 1] as string | number;
        // existing value at node path
        const existingValue = typeof lastSeg === "number" ? targetParent[lastSeg] : targetParent[lastSeg];

        if (typeof existingValue === "object" && existingValue !== null && !Array.isArray(existingValue) && typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
          // merge fields: only overwrite keys provided in parsed, preserve children and others
          Object.keys(parsed).forEach(k => {
            existingValue[k] = parsed[k];
          });
          // assign back just in case
          if (typeof lastSeg === "number") targetParent[lastSeg] = existingValue;
          else targetParent[lastSeg] = existingValue;
        } else {
          // fallback: replace the value (arrays or primitives)
          if (typeof lastSeg === "number") targetParent[lastSeg] = parsed;
          else targetParent[lastSeg] = parsed;
        }

        const newJsonStr = JSON.stringify(currentJson, null, 2);
        useFile.getState().setContents({ contents: newJsonStr, skipUpdate: true });
        useJson.getState().setJson(newJsonStr);
      }

    } catch (e) {
      // if any error occurs, still update selected node locally
      // (fail silently for persistence)
    }

    setSelectedNode(updatedNode);
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
            <Flex gap="sm" align="center">
              <Button size="xs" variant="outline" color="gray" onClick={() => setIsEditing(true)} disabled={isEditing}>
                Edit
              </Button>
              <Button size="xs" color="green" onClick={handleSave} disabled={!isEditing}>
                Save
              </Button>
              <Button size="xs" color="red" variant="subtle" onClick={handleCancel} disabled={!isEditing}>
                Cancel
              </Button>
              <CloseButton onClick={onClose} />
            </Flex>
          </Flex>
          <ScrollArea.Autosize mah={250} maw={600}>
            {isEditing ? (
              <Textarea
                minRows={6}
                value={editValue}
                onChange={e => setEditValue(e.currentTarget.value)}
                styles={{ input: { fontFamily: "monospace" } }}
              />
            ) : (
              <CodeHighlight
                code={normalizeNodeData(nodeData?.text ?? [])}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
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
