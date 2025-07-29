import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Button, Textarea, Group } from "@mantine/core";
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
  const rawJson = useJson(state => state.json);
  const setJson = useJson(state => state.setJson);
  const selectedNode = useGraph(state => state.selectedNode);
  const path = useGraph(state => state.selectedNode?.path || "");
  const setContents = useFile(state => state.setContents); //jadd
  const setGraph = useGraph(state => state.setGraph);
  const setSelectedNode = useGraph(state => state.setSelectedNode);
  const nodeData = selectedNode ? dataToString(selectedNode.text) : "";

  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState("");

 React.useEffect(() => {
    if (selectedNode) {
      setDraft(dataToString(selectedNode.text));
      setIsEditing(false);
    }
  }, [selectedNode]);

  const handleEdit = () => {
    if (selectedNode) {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    if (selectedNode) {
    setDraft(dataToString(selectedNode.text));
    setIsEditing(false);
    }
  };

    const handleSave = () => {
    try {
      const newValue = JSON.parse(draft);
      const currentJson = JSON.parse(rawJson);
      
      const updateJsonAtPath = (obj, jsonPath, value) => {

        const cleanPath = jsonPath.replace(/^\{Root\}\.?/, "");
        const clone = JSON.parse(JSON.stringify(obj));
        const pathParts = cleanPath
          .split(/[\.\[\]]+/)
          .filter(Boolean);
          
        let current = clone;
        
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (!isNaN(Number(part))) {
            current = current[Number(part)];
          } else {
            current = current[part];
          }
        }
        
        const lastPart = pathParts[pathParts.length - 1];
        if (!isNaN(Number(lastPart))) {
          current[Number(lastPart)] = value;
        } else {
          current[lastPart] = value;
        }
        return clone;
      };
      
      const updatedJson = updateJsonAtPath(currentJson, path, newValue);
      const updatedJsonString = JSON.stringify(updatedJson, null, 2);
      setJson(updatedJsonString);
      setContents({ contents: updatedJsonString }); //jadd
      setGraph(updatedJsonString);
      setSelectedNode({ ...selectedNode, text: newValue });
      setIsEditing(false);
    } catch (error) {
      console.error("Invalid JSON format", error);
    }
  };

    return (
      <Modal title="Node Content" size="auto" opened={opened} onClose={onClose} centered>
        <Stack py="sm" gap="sm">
          <Stack gap="xs">
            <Group justify="space-between" align="center">
              <Text fz="xs" fw={500}>
                Content
              </Text>
              <Group gap="xs">
                {!isEditing ? (
                  <Button size="xs" variant="outline" onClick={handleEdit}>
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button size="xs" onClick={handleSave}>
                      Save
                    </Button>
                    <Button size="xs" variant="subtle" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </> 
                )}
              </Group>
            </Group>
            <ScrollArea.Autosize mah={350} maw={800}>
              {isEditing ? (
                <Textarea
                  autosize
                  minRows={6}
                  value={draft}
                  onChange={(e) => setDraft(e.currentTarget.value)}
                  styles={{
                    input: {
                      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                      fontSize: '12px',
                    }
                  }}
                />
              ) : (
                <CodeHighlight code={nodeData} miw={350} maw={800} language="json" withCopyButton />
              )}
            </ScrollArea.Autosize>
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