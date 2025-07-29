import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Group } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson";
import useFile from "../../../store/useFile";

const dataToString = (data: any) => {
  const text = Array.isArray(data) ? Object.fromEntries(data) : data;
  const replacer = (_: string, v: string) => {
    if (typeof v === "string") return v.replaceAll('"', "");
    return v;
  };

  return JSON.stringify(text, replacer, 2);
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  // Use useJson hook to update the JSON state
  // const setJson = useJson(state => state.setJson); // Remove setJson for graph-only update
  const nodeData = useGraph(state => dataToString(state.selectedNode?.text));
  const path = useGraph(state => state.selectedNode?.path || "");
  const selectedNode = useGraph(state => state.selectedNode);
  const setSelectedNode = useGraph(state => state.setSelectedNode);
  const updateNode = useGraph(state => state.updateNode);
  const setContents = useFile(state => state.setContents);
  const [editMode, setEditMode] = React.useState(false);
  const [editValue, setEditValue] = React.useState(nodeData);
  const [originalValue, setOriginalValue] = React.useState(nodeData);

  // Keep originalValue in sync with nodeData when not editing
  React.useEffect(() => {
    if (!editMode) {
      setEditValue(nodeData);
      setOriginalValue(nodeData);
    }
  }, [nodeData, editMode]);

  return (
    <Modal title="Node Content" size="auto" opened={opened} onClose={onClose} centered>
      <Stack py="sm" gap="sm">
        <Stack gap="xs">
          {/* Use Mantine Group for horizontal layout */}
          <Group justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            {!editMode ? (
              <button
                style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, border: 'none', background: '#24353F', color: '#72BCF6', cursor: 'pointer' }}
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
            ) : (
              <Group>
                <button
                  style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, border: 'none', background: '#2F9E44', color: '#FFF', cursor: 'pointer', marginLeft: 8 }}
                  onClick={() => {
                    if (selectedNode) {
                      // Try to parse the editValue as JSON, fallback to string
                      let newText: string | [string, string][] = editValue;
                      try {
                        newText = JSON.parse(editValue);
                      } catch {}
                      updateNode(selectedNode.id, { text: newText });
                      setSelectedNode({ ...selectedNode, text: newText });
                      // Update the JSON text editor as well
                      setContents({
                        contents: (() => {
                          // Get the current JSON from the editor
                          let json;
                          try {
                            json = JSON.parse(useFile.getState().contents);
                          } catch {
                            json = useFile.getState().contents;
                          }
                          // Traverse to the node at the path and update it
                          if (path) {
                            const pathArr = path.split('.').filter(Boolean);
                            let ref = json;
                            for (let i = 0; i < pathArr.length - 1; i++) {
                              if (ref[pathArr[i]] === undefined) break;
                              ref = ref[pathArr[i]];
                            }
                            if (ref && pathArr.length > 0) {
                              try {
                                ref[pathArr[pathArr.length - 1]] = newText;
                              } catch {}
                            }
                          }
                          return JSON.stringify(json, null, 2);
                        })(),
                        hasChanges: true
                      });
                    }
                    setEditMode(false);
                    setOriginalValue(editValue);
                  }}
                >
                  Save
                </button>
                                <button
                  style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, border: 'none', background: '#343A40', color: '#FFF', cursor: 'pointer' }}
                  onClick={() => {
                    setEditMode(false);
                    setEditValue(originalValue);
                  }}
                >
                  Cancel
                </button>
              </Group>
            )}
          </Group>
          {editMode ? (
            <textarea
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              style={{ width: '100%', minHeight: 150, maxHeight: 250, minWidth: 350, maxWidth: 600, fontFamily: 'monospace', fontSize: 14, background: '#1A232B', color: '#72BCF6', borderRadius: 6, border: '1px solid #24353F', padding: 8, resize: 'vertical' }}
            />
          ) : (
            <ScrollArea.Autosize mah={250} maw={600}>
              <CodeHighlight code={nodeData} miw={350} maw={600} language="json" withCopyButton />
            </ScrollArea.Autosize>
          )}
        </Stack>
        <Text fz="xs" fw={500}>
          JSON Path
        </Text>
        <ScrollArea.Autosize maw={600}>
          <CodeHighlight
            code={path}
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
