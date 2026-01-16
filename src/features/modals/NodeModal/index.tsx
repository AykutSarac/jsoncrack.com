import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, Textarea, Group } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useFile from "../../../store/useFile";
import useJson from "../../../store/useJson";
import { contentToJson } from "../../../lib/utils/jsonAdapter";

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
  const contents = useFile(state => state.contents);
  const setContents = useFile(state => state.setContents);
  const setJson = useJson(state => state.setJson);

  const [editing, setEditing] = React.useState(false);
  const [localValue, setLocalValue] = React.useState("");

  React.useEffect(() => {
    // when opening modal reset editing state and local value
    if (opened) {
      setEditing(false);
      setLocalValue(normalizeNodeData(nodeData?.text ?? []));
    }
  }, [opened, nodeData]);

  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <Group spacing="xs">
              {!editing && (
                <Button size="xs" variant="default" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              )}
              {editing && (
                <>
                  <Button
                    size="xs"
                    color="green"
                    onClick={async () => {
                      try {
                        // parse the left editor contents into an object
                        const root = await contentToJson(contents);
                        // parse the edited content
                        const edited = await contentToJson(localValue);

                        // helper to get value by path
                        const getByPath = (obj: any, path?: any[]) => {
                          if (!path || path.length === 0) return obj;
                          return path.reduce((acc: any, cur: any) => (acc ? acc[cur] : undefined), obj);
                        };

                        // helper to set value at path
                        const setByPath = (obj: any, path: any[] | undefined, value: any) => {
                          if (!path || path.length === 0) return value;
                          const last = path[path.length - 1];
                          const parentPath = path.slice(0, -1);
                          const parent = parentPath.length === 0 ? obj : getByPath(obj, parentPath);
                          if (!parent) return;
                          parent[last] = value;
                        };

                        const path = nodeData?.path;

                        const currentTarget = getByPath(root, path as any[] | undefined);

                        if (currentTarget && typeof currentTarget === "object" && !Array.isArray(currentTarget) && edited && typeof edited === "object") {
                          // merge primitive fields into object node
                          Object.keys(edited).forEach(k => {
                            currentTarget[k] = edited[k];
                          });
                        } else if (typeof path !== "undefined" && path && path.length > 0) {
                          setByPath(root, path as any[], edited);
                        } else {
                          // root replacement
                          // if edited is object merge, otherwise replace root
                          if (edited && typeof edited === "object" && !Array.isArray(edited)) {
                            Object.keys(edited).forEach(k => {
                              (root as any)[k] = edited[k];
                            });
                          } else {
                            // replace root completely
                            // setContents expects a string
                            await setContents({ contents: JSON.stringify(edited, null, 2), hasChanges: true });
                            setJson(JSON.stringify(edited, null, 2));
                            setEditing(false);
                            return;
                          }
                        }

                        const newContents = JSON.stringify(root, null, 2);
                        await setContents({ contents: newContents, hasChanges: true });
                        setJson(newContents);
                        setEditing(false);
                      } catch (error) {
                        // if parsing fails, keep editing mode
                        // ideally show an error toast
                        // console.error(error);
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    size="xs"
                    color="gray"
                    variant="outline"
                    onClick={() => {
                      // discard changes
                      setLocalValue(normalizeNodeData(nodeData?.text ?? []));
                      setEditing(false);
                    }}
                  >
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
                styles={{ input: { fontFamily: "monospace" } }}
                minRows={6}
                maw={600}
                value={localValue}
                onChange={e => setLocalValue(e.currentTarget.value)}
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
