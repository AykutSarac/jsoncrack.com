import React from "react";
import dynamic from "next/dynamic";
import { Modal, Group, Button, Stack, Divider, Text, Menu } from "@mantine/core";
import toast from "react-hot-toast";
import { AiOutlineMenu } from "react-icons/ai";
import { FiCopy } from "react-icons/fi";
import coldarkCold from "react-syntax-highlighter/dist/cjs/styles/prism/coldark-cold";
import oneDark from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";
import useGraph from "src/store/useGraph";
import useStored from "src/store/useStored";

const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter/dist/cjs/prism-async"), {
  ssr: false,
});

interface NodeModalProps {
  visible: boolean;
  closeModal: () => void;
}

const CodeBlock: React.FC<{ children: string | string[] }> = ({ children }) => {
  const lightmode = useStored(state => state.lightmode);

  return (
    <SyntaxHighlighter
      language="json"
      style={lightmode ? coldarkCold : oneDark}
      customStyle={{
        borderRadius: "4px",
        fontSize: "14px",
        margin: "0",
        maxHeight: "250px",
        maxWidth: "600px",
        minWidth: "350px"
      }}
      showLineNumbers
    >
      {children}
    </SyntaxHighlighter>
  );
};

export const NodeModal = ({ visible, closeModal }: NodeModalProps) => {
  const path = useGraph(state => state.path);
  const nodeData = useGraph(state =>
    Array.isArray(state.selectedNode) ? Object.fromEntries(state.selectedNode) : state.selectedNode
  );

  const handleClipboard = (content: string) => {
    try {
      navigator.clipboard?.writeText(content);
      toast.success("Content copied to clipboard!");
      closeModal();
    } catch (error) {
      toast.error("Failed to save to clipboard.");
    }
  };

  return (
    <Modal title="Node Content" size="auto" opened={visible} onClose={closeModal} centered>
      <Stack py="sm" spacing="sm">
        <Stack spacing="xs">
          <Text fz="sm" fw={700}>
            Content
          </Text>
          <CodeBlock>
            {JSON.stringify(
              nodeData,
              (_, v) => {
                if (typeof v === "string") return v.replaceAll('"', "");
                return v;
              },
              2
            )}
          </CodeBlock>
        </Stack>
        <Stack spacing="xs">
          <Text fz="sm" fw={700}>
            Node Path
          </Text>
          <CodeBlock>{path}</CodeBlock>
        </Stack>
      </Stack>
      <Divider py="xs" />
      <Group position="right">
        <Menu trigger="hover" openDelay={100} closeDelay={400}>
          <Menu.Target>
            <Button color="gray" leftIcon={<AiOutlineMenu />}>
              Actions
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<FiCopy />} onClick={() => handleClipboard(JSON.stringify(nodeData))}>
              Clipboard JSON
            </Menu.Item>
            <Menu.Item icon={<FiCopy />} onClick={() => handleClipboard(path)}>
              Clipboard Path to Node
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Modal>
  );
};
