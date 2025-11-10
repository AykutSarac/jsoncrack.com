import React, { useState } from "react";
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
  const setJson = useJson(state => state.setJson);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const handleEdit = () => {
    // Get the full object at this node's path from the JSON
    if (nodeData?.path) {
      try {
        const json = useJson.getState().json;
        const parsedJson = JSON.parse(json);
        let current = parsedJson;
        
        // Navigate to the target using the path
        for (let i = 0; i < nodeData.path.length; i++) {
          current = current[nodeData.path[i]];
        }
        
        // Set the edited content to the full object/value at this path
        setEditedContent(JSON.stringify(current, null, 2));
        setIsEditing(true);
      } catch (error) {
        alert("Error loading content for editing.");
      }
    }
  };

  const handleSave = () => {
    try {
      // Get the current JSON
      const json = useJson.getState().json;
      const parsedJson = JSON.parse(json);

      // Update the value at the node's path
      if (nodeData?.path) {
        let current = parsedJson;
        const path = nodeData.path;

        // Navigate to the parent of the target
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
        }

        // Update the final key with the new value
        const lastKey = path[path.length - 1];
        
        // Get the existing object at this path to preserve nested properties
        const existingValue = current[lastKey];
        
        if (typeof existingValue === "object" && existingValue !== null) {
          // If the existing value is an object/array, parse the edited content as JSON
          try {
            current[lastKey] = JSON.parse(editedContent);
          } catch {
            alert("Invalid JSON format for this object.");
            return;
          }
        } else {
          // If it's a primitive, try to parse as JSON first, then treat as string
          try {
            current[lastKey] = JSON.parse(editedContent);
          } catch {
            current[lastKey] = editedContent;
          }
        }

        // Update both the file contents and JSON store
        const updatedJson = JSON.stringify(parsedJson, null, 2);
        useFile.getState().setContents({ contents: updatedJson });
        setIsEditing(false);
      }
    } catch (error) {
      alert("Error saving changes. Please check your input.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent("");
  };

  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        {isEditing ? (
          <Flex gap="xs" style={{ alignSelf: "flex-end" }}>
            <Button mb="xs" size="xs" onClick={handleSave} color="green" style={{ width: 80 }}>
              Save
            </Button>
            <Button mb="xs" size="xs" onClick={handleCancel} color="red" style={{ width: 80 }}>
              Cancel
            </Button>
          </Flex>
        ) : (
          <Button mb="xs" size="xs" onClick={handleEdit} style={{ alignSelf: "flex-end", width: 80 }}>
            Edit
          </Button>
        )}
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <CloseButton onClick={onClose} />
          </Flex>
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={e => setEditedContent(e.currentTarget.value)}
              placeholder="Edit JSON content..."
              minRows={6}
              maxRows={12}
              style={{ fontFamily: "monospace" }}
            />
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
