import React, { useState } from "react";
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
  const [editing, setEditing] = useState(false); // New state for editing

  const handleEdit = () => {
    setEditing(true); // Set editing to true
  };

  const handleSave = () => {
    setEditing(false); // Set editing to false
    // Add save functionality here
  };

  const handleCancel = () => {
    setEditing(false); // Set editing to false
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
            <CodeHighlight
              code={normalizeNodeData(nodeData?.text ?? [])}
              miw={350}
              maw={600}
              language="json"
              withCopyButton
            />
            <Flex justify="flex-end" align="flex-end" style={{ marginTop: '10px' }}>
              {!editing ? ( // Conditional rendering based on editing state
                <button
                  onClick={handleEdit}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    backgroundColor: '#36393e', // Adjust color as needed
                    color: '#fff', // Adjust text color as needed
                    fontSize: '1rem', // Match font size
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
                      backgroundColor: '#36393e', // Adjust color as needed
                      color: '#fff', // Adjust text color as needed
                      fontSize: '1rem', // Match font size
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
                      backgroundColor: '#36393e', // Adjust color as needed
                      color: '#fff', // Adjust text color as needed
                      fontSize: '1rem', // Match font size
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
