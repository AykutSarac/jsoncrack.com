import React from "react";
import { Modal, Stack, Text, ScrollArea, ModalProps } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { shallow } from "zustand/shallow";
import useGraph from "src/store/useGraph";
import { dataToString } from "src/utils/dataToString";

const CodeBlock: React.FC<{ children: any }> = ({ children }) => {
  return (
    <ScrollArea>
      <Prism
        maw={600}
        miw={350}
        mah={250}
        language="json"
        copyLabel="Copy to clipboard"
        copiedLabel="Copied to clipboard"
        withLineNumbers
      >
        {children}
      </Prism>
    </ScrollArea>
  );
};

export const NodeModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const [nodeData, path] = useGraph(
    state => [dataToString(state.selectedNode.text), state.selectedNode.path],
    shallow
  );

  return (
    <Modal title="Node Content" size="auto" opened={opened} onClose={onClose} centered>
      <Stack py="sm" spacing="sm">
        <Stack spacing="xs">
          <Text fz="sm" fw={700}>
            Content
          </Text>
          <CodeBlock>{nodeData}</CodeBlock>
        </Stack>
        <Stack spacing="xs">
          <Text fz="sm" fw={700}>
            Node Path
          </Text>
          <CodeBlock>{path}</CodeBlock>
        </Stack>
      </Stack>
    </Modal>
  );
};
