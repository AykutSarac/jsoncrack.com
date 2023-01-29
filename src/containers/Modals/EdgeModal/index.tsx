import React from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { vs } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import useStored from "src/store/useStored";

const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter/dist/esm/prism-async").then(c => c),
  {
    ssr: false,
  }
);

interface EdgeModalProps {
  selectedEdge: string;
  visible: boolean;
  closeModal: () => void;
}

export const EdgeModal = ({ selectedEdge, visible, closeModal }: EdgeModalProps) => {
  const lightmode = useStored(state => state.lightmode);
  const handleClipboard = () => {
    toast.success("Content copied to clipboard!");
    navigator.clipboard.writeText(selectedEdge);
    closeModal();
  };

  return (
    <Modal visible={visible} setVisible={closeModal}>
      <Modal.Header>Edge Content</Modal.Header>
      <Modal.Content>
        <SyntaxHighlighter
          style={lightmode ? vs : vscDarkPlus}
          customStyle={{
            borderRadius: "4px",
            fontSize: "14px",
            margin: "0",
          }}
          language="javascript"
        >
          {selectedEdge}
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
