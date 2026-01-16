import React, { useEffect, useState } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, TextInput } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson"; 

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

// Extract editable fields from node data
const getEditableFields = (nodeRows?: NodeData["text"]) => {
  if (!nodeRows || nodeRows.length === 0) return [];
  
  return nodeRows.filter(row => 
    row.type !== "array" && row.type !== "object" && row.key
  ).map(row => ({
    key: row.key,
    value: row.value
  }));
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);
  const nodes = useGraph(state => state.nodes);
  const edges = useGraph(state => state.edges);
  const setSelectedNode = useGraph(state => state.setSelectedNode);
  const setJson = useJson(state => state.setJson);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState<Array<{ key: string; value: string }>>([]);

  // Initialize editable fields when modal opens or nodeData changes
  useEffect(() => {
    if (nodeData?.text) {
      setEditableFields(getEditableFields(nodeData.text).map(field => ({
        key: field.key || '',
        value: String(field.value)
      })));
    }
  }, [nodeData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!nodeData) return;

    // Create updated node data with new values
    const updatedText = nodeData.text.map(row => {
      const editedField = editableFields.find(field => field.key === row.key);
      if (editedField) {
        return { ...row, value: editedField.value };
      }
      return row;
    });

    // Update the nodes array with the modified node
    const updatedNodes = nodes.map(node => {
      if (node.id === nodeData.id) {
        const updatedNode = { ...node, text: updatedText };
        // Also update the selected node
        setSelectedNode(updatedNode);
        return updatedNode;
      }
      return node;
    });

    // Update the store with the new nodes array
    useGraph.setState({ nodes: updatedNodes });

    try {
      const currentJson = useJson.getState().json;
      const jsonObject = JSON.parse(currentJson);
      
      const updatedJsonObject = JSON.parse(JSON.stringify(jsonObject));
      
      // Navigate to the correct path in the JSON and update it
      if (nodeData.path && nodeData.path.length > 0) {
        let target = updatedJsonObject;
        
        // Navigate to the parent of the target location
        for (let i = 0; i < nodeData.path.length - 1; i++) {
          target = target[nodeData.path[i]];
        }
        
        const finalKey = nodeData.path[nodeData.path.length - 1];
        const targetObject = target[finalKey];
        
        if (targetObject && typeof targetObject === 'object' && !Array.isArray(targetObject)) {
          editableFields.forEach(field => {
            targetObject[field.key] = field.value;
          });
        }
      } else {
        editableFields.forEach(field => {
          updatedJsonObject[field.key] = field.value;
        });
      }
      
      // Update the JSON store with the new object using the setter from the hook
      const updatedJson = JSON.stringify(updatedJsonObject, null, 2);
      setJson(updatedJson);
      
      console.log('JSON updated successfully:', updatedJson);
    } catch (error) {
      console.error('Failed to update JSON:', error);
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset fields to original values
    if (nodeData?.text) {
      setEditableFields(getEditableFields(nodeData.text).map(field => ({
        key: field.key || '',
        value: String(field.value)
      })));
    }
    setIsEditing(false);
  };

  const handleFieldChange = (key: string, value: string) => {
    setEditableFields(prev => 
      prev.map(field => 
        field.key === key ? { ...field, value } : field
      )
    );
  };

  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <Flex gap="xs" align="center">
              {isEditing ? (
                <>
                  <Button 
                    size="xs" 
                    variant="filled"
                    color="green"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button 
                    size="xs" 
                    variant="filled"
                    color="red"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  size="xs" 
                  variant="filled"
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              )}
              <CloseButton onClick={onClose} />
            </Flex>
          </Flex>
          <ScrollArea.Autosize mah={250} maw={600}>
            {isEditing ? (
              <Stack gap="sm" p="sm" style={{ minWidth: 350, maxWidth: 600 }}>
                {editableFields.map((field) => (
                  <TextInput
                    key={field.key}
                    label={field.key}
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.key, e.currentTarget.value)}
                  />
                ))}
              </Stack>
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