import React, { useMemo, useState } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, TextInput, Button } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useFile from "../../../store/useFile";
import { contentToJson } from "../../../lib/utils/jsonAdapter";
import { FileFormat } from "../../../enums/file.enum";
import { toast } from "react-hot-toast";

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
  const updateNode = useGraph(state => state.updateNode);

  // local editable copy of text rows and color
  const initialRows = useMemo(() => JSON.parse(JSON.stringify(nodeData?.text ?? [])), [nodeData]);
  const [rows, setRows] = useState<NodeData["text"]>(initialRows);
  const [color, setColor] = useState<string | undefined>(nodeData?.color);
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    setRows(JSON.parse(JSON.stringify(nodeData?.text ?? [])));
    setColor(nodeData?.color);
    setIsEditing(false);
  }, [nodeData]);

  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {!isEditing ? (
                <Button size="xs" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => {
                      // cancel edits
                      setRows(JSON.parse(JSON.stringify(nodeData?.text ?? [])));
                      setColor(nodeData?.color);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="xs"
                    onClick={async () => {
                      if (!nodeData) return;
                      // if there's a name field, set displayName
                      const nameRow = rows.find(r => r.key === "name");
                      const displayName = nameRow ? String(nameRow.value) : undefined;
                      // if there is a color row, sync color state
                      const colorRow = rows.find(r => r.key === "color");
                      const appliedColor = colorRow ? String(colorRow.value) : color;

                      // update visualization node
                      updateNode(nodeData.id, { text: rows, color: appliedColor, displayName });

                      // also persist changes back to editor JSON
                      try {
                        const contents = useFile.getState().getContents();
                        const obj = await contentToJson(contents, FileFormat.JSON);

                        const setValue = (target: any, key: string | number, value: any) => {
                          if (typeof key === "number" && Array.isArray(target)) target[key] = value;
                          else target[key as string] = value;
                        };

                        // navigate to node path
                        let target = obj;
                        const path = nodeData.path ?? [];
                        for (let i = 0; i < path.length; i++) {
                          const seg = path[i] as any;
                          if (i === path.length - 1) {
                            // stop at parent for object editing
                            if (seg !== undefined) {
                              target = target[seg];
                            }
                          } else {
                            target = target[seg];
                          }
                        }

                        // If single value node (no keys), set the value at path
                        if (rows.length === 1 && !rows[0].key) {
                          // navigate to parent and set property or array index
                          if (path.length === 0) {
                            // root value
                            // replace whole object
                            const newVal = (() => {
                              try {
                                return JSON.parse(String(rows[0].value));
                              } catch {
                                return rows[0].value;
                              }
                            })();
                            useFile.getState().setContents({ contents: JSON.stringify(newVal, null, 2), hasChanges: true });
                          } else {
                            // set value at path
                            // find parent
                            const parentPath = path.slice(0, -1);
                            let parent = obj;
                            for (const p of parentPath) parent = parent[p as any];
                            const last = path[path.length - 1] as any;
                            const newVal = (() => {
                              try {
                                return JSON.parse(String(rows[0].value));
                              } catch {
                                return rows[0].value;
                              }
                            })();
                            setValue(parent, last, newVal);
                            useFile.getState().setContents({ contents: JSON.stringify(obj, null, 2), hasChanges: true });
                          }
                        } else {
                          // assume target is an object, update keyed fields
                          // if path points to value instead of object, try parent
                          if (typeof target !== "object" || Array.isArray(target)) {
                            // try to find parent object
                            let parent = obj;
                            for (let i = 0; i < path.length - 1; i++) parent = parent[path[i] as any];
                            target = parent[path[path.length - 1] as any];
                          }

                          if (target && typeof target === "object") {
                            rows.forEach(r => {
                              if (r.key) {
                                let val: any = r.value;
                                try {
                                  val = JSON.parse(String(r.value));
                                } catch {
                                  // keep as string
                                }
                                target[r.key] = val;
                              }
                            });
                            useFile.getState().setContents({ contents: JSON.stringify(obj, null, 2), hasChanges: true });
                          }
                        }

                        toast.success("Node saved");
                      } catch (err: any) {
                        toast.error("Failed to save node: " + (err?.message ?? String(err)));
                      }

                      setIsEditing(false);
                    }}
                  >
                    Save
                  </Button>
                </>
              )}
              <CloseButton onClick={onClose} />
            </div>
          </Flex>

          {isEditing ? (
            <ScrollArea.Autosize mah={250} maw={600}>
              <Stack gap="xs">
                {rows.length === 1 && !rows[0].key ? (
                  // single value node
                  <div>
                    <Text fz="xs">Value</Text>
                    <TextInput
                      value={String(rows[0].value ?? "")}
                      onChange={e => {
                        const copy = [...rows];
                        copy[0] = { ...copy[0], value: e.target.value };
                        setRows(copy);
                      }}
                    />
                  </div>
                ) : (
                  rows.map((r, idx) => (
                    <div key={`${nodeData?.id}-edit-${idx}`}>
                      <Text fz="xs">{r.key ?? `Field ${idx + 1}`}</Text>
                      {r.key === "color" || (typeof r.value === "string" && /^#([0-9A-Fa-f]{3}){1,2}$/.test(String(r.value))) ? (
                        <input
                          type="color"
                          value={String(r.value ?? color ?? "#ffffff")}
                          onChange={e => {
                            const copy = [...rows];
                            copy[idx] = { ...copy[idx], value: e.target.value };
                            setRows(copy);
                            setColor(e.target.value);
                          }}
                        />
                      ) : (
                        <TextInput
                          value={String(r.value ?? "")}
                          onChange={e => {
                            const copy = [...rows];
                            copy[idx] = { ...copy[idx], value: e.target.value };
                            setRows(copy);
                          }}
                        />
                      )}
                    </div>
                  ))
                )}
              </Stack>
            </ScrollArea.Autosize>
          ) : (
            <ScrollArea.Autosize mah={250} maw={600}>
              <CodeHighlight
                code={normalizeNodeData(nodeData?.text ?? [])}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
            </ScrollArea.Autosize>
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
