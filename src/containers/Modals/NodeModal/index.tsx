import React from "react";
import { Modal, Stack, Text, ScrollArea, ModalProps, Button } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { FiExternalLink } from "react-icons/fi";
import { shallow } from "zustand/shallow";
import useGraph from "src/store/useGraph";

const dataToString = (data: any) => {
  const text = Array.isArray(data) ? Object.fromEntries(data) : data;
  const replacer = (_: string, v: string) => {
    if (typeof v === "string") return v.replaceAll('"', "");
    return v;
  };

  return JSON.stringify(text, replacer, 2);
};

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
  const [nodeData, path, isParent] = useGraph(
    state => [
      dataToString(state.selectedNode.text),
      state.selectedNode.path,
      state.selectedNode.data?.isParent,
    ],
    shallow
  );

  const isEditVisible = path !== "{Root}" && !isParent;

  return (
    <Modal title="Node Content" size="auto" opened={opened} onClose={onClose} centered>
      <Stack py="sm" spacing="sm">
        <Stack spacing="xs">
          <Text fz="sm" fw={700}>
            Content
          </Text>
          <CodeBlock>{nodeData}</CodeBlock>
        </Stack>
        {isEditVisible && (
          <Button
            component="a"
            href="https://editor.herowand.com"
            leftIcon={<FiExternalLink />}
            variant="filled"
          >
            Edit
          </Button>
        )}

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
