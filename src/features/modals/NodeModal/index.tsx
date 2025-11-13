import React, { useState, useEffect } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";

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
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(normalizeNodeData(nodeData?.text ?? []));
  const [originalContent, setOriginalContent] = useState(editedContent); // Store original content

  useEffect(() => {
    setEditedContent(normalizeNodeData(nodeData?.text ?? [])); // Reset edited content when nodeData changes
    setOriginalContent(normalizeNodeData(nodeData?.text ?? [])); // Update original content
    setEditing(false); // Ensure editing is false when node changes
  }, [nodeData]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setOriginalContent(editedContent); // Save changes
    setEditing(false);
    // Add save functionality here
  };

  const handleCancel = () => {
    setEditedContent(originalContent); // Revert to original content
    setEditing(false);
  };

  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <CloseButton onClick={onClose} />
          </Flex>
          <ScrollArea.Autosize mah={250} maw={600}>
            {editing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  padding: '5px',
                  fontSize: '1rem',
                }}
              />
            ) : (
              <CodeHighlight
                code={editedContent}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
            )}
            <Flex justify="flex-end" align="flex-end" style={{ marginTop: '10px' }}>
              {!editing ? (
                <button
                  onClick={handleEdit}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    backgroundColor: '#36393e',
                    color: '#fff',
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '5px',
                      backgroundColor: '#36393e',
                      color: '#fff',
                      fontSize: '1rem',
                      border: 'none',
                      cursor: 'pointer',
                      marginRight: '5px'
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '5px',
                      backgroundColor: '#36393e',
                      color: '#fff',
                      fontSize: '1rem',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </Flex>
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
