import React from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import vs from "react-syntax-highlighter/dist/cjs/styles/prism/vs";
import vscDarkPlus from "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import useGraph from "src/store/useGraph";
import useStored from "src/store/useStored";
import styled from "styled-components";

const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter/dist/cjs/prism-async"), {
  ssr: false,
});

interface NodeModalProps {
  visible: boolean;
  closeModal: () => void;
}

const StyledTitle = styled.div`
  line-height: 16px;
  font-size: 12px;
  font-weight: 600;
  padding: 16px 0;

  &:first-of-type {
    padding-top: 0;
  }
`;

export const NodeModal = ({ visible, closeModal }: NodeModalProps) => {
  const lightmode = useStored(state => state.lightmode);
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
    <Modal visible={visible} setVisible={closeModal} size="lg">
      <Modal.Header>Node Content</Modal.Header>
      <Modal.Content>
        <StyledTitle>Content</StyledTitle>
        <SyntaxHighlighter
          style={lightmode ? vs : vscDarkPlus}
          customStyle={{
            borderRadius: "4px",
            fontSize: "14px",
            margin: "0",
          }}
          language="json"
          showLineNumbers
        >
          {JSON.stringify(
            nodeData,
            (_, v) => {
              if (typeof v === "string") return v.replaceAll('"', "");
              return v;
            },
            2
          )}
        </SyntaxHighlighter>
        <StyledTitle>Node Path</StyledTitle>
        <SyntaxHighlighter
          style={lightmode ? vs : vscDarkPlus}
          customStyle={{
            borderRadius: "4px",
            fontSize: "14px",
            margin: "0",
          }}
          language="javascript"
        >
          {path}
        </SyntaxHighlighter>
      </Modal.Content>
      <Modal.Controls setVisible={closeModal}>
        <Button status="SECONDARY" onClick={() => handleClipboard(JSON.stringify(nodeData))}>
          <FiCopy size={18} /> Clipboard
        </Button>
        <Button status="SECONDARY" onClick={() => handleClipboard(path)}>
          <FiCopy size={18} /> Copy Path
        </Button>
      </Modal.Controls>
    </Modal>
  );
};
