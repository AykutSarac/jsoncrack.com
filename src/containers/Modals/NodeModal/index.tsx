import React from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import vs from "react-syntax-highlighter/dist/cjs/styles/prism/vs";
import vscDarkPlus from "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import useStored from "src/store/useStored";

const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter/dist/esm/prism-async"), {
  ssr: false,
});

interface NodeModalProps {
  selectedNode: object;
  visible: boolean;
  closeModal: () => void;
}

export const NodeModal = ({ selectedNode, visible, closeModal }: NodeModalProps) => {
  const lightmode = useStored(state => state.lightmode);
  const nodeData = Array.isArray(selectedNode) ? Object.fromEntries(selectedNode) : selectedNode;

  const handleClipboard = () => {
    toast.success("Content copied to clipboard!");
    navigator.clipboard?.writeText(JSON.stringify(nodeData));
    closeModal();
  };

  return (
    <Modal visible={visible} setVisible={closeModal} size="lg">
      <Modal.Header>Node Content</Modal.Header>
      <Modal.Content>
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
      </Modal.Content>
      <Modal.Controls setVisible={closeModal}>
        <Button status="SECONDARY" onClick={handleClipboard}>
          <FiCopy size={18} /> Clipboard
        </Button>
      </Modal.Controls>
    </Modal>
  );
};
