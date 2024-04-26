import React from "react";
import { Modal, Stack, Text, ScrollArea, ModalProps, Button } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import { VscLock } from "react-icons/vsc";
import useGraph from "src/store/useGraph";
import useModal from "src/store/useModal";

const dataToString = (data: any) => {
  const text = Array.isArray(data) ? Object.fromEntries(data) : data;
  const replacer = (_: string, v: string) => {
    if (typeof v === "string") return v.replaceAll('"', "");
    return v;
  };

  return JSON.stringify(text, replacer, 2);
};

export const NodeModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const setVisible = useModal(state => state.setVisible);
  const nodeData = useGraph(state => dataToString(state.selectedNode?.text));
  const path = useGraph(state => state.selectedNode?.path || "");

  return (
    <Modal title="Node Content" size="auto" opened={opened} onClose={onClose} centered>
      <Stack py="sm" gap="sm">
        <Stack gap="xs">
          <Text fz="sm" fw={700}>
            Content
          </Text>
          <ScrollArea.Autosize mah={250} maw={600}>
            <CodeHighlight code={nodeData} miw={350} maw={600} language="json" withCopyButton />
          </ScrollArea.Autosize>
        </Stack>
        <Button
          onClick={() => setVisible("premium")(true)}
          rightSection={<VscLock strokeWidth={0.5} />}
        >
          Edit
        </Button>
        <Text fz="sm" fw={700}>
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
