import React from "react";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import styled from "styled-components";

interface NodeModalProps {
  selectedNode: object;
  visible: boolean;
  closeModal: () => void;
}

const StyledTextarea = styled.textarea`
  resize: none;
  width: 100%;
  min-height: 200px;

  padding: 10px;
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  outline: none;
  border-radius: 4px;
  line-height: 20px;
  border: none;
`;

export const NodeModal = ({
  selectedNode,
  visible,
  closeModal,
}: NodeModalProps) => {
  const nodeData = Array.isArray(selectedNode)
    ? Object.fromEntries(selectedNode)
    : selectedNode;

  const handleClipboard = () => {
    toast.success("Content copied to clipboard!");
    navigator.clipboard.writeText(JSON.stringify(nodeData));
    closeModal();
  };

  return (
    <Modal visible={visible} setVisible={closeModal}>
      <Modal.Header>Node Content</Modal.Header>
      <Modal.Content>
        <StyledTextarea
          defaultValue={JSON.stringify(
            nodeData,
            (_, v) => {
              if (typeof v === "string") return v.replaceAll('"', "");
              return v;
            },
            2
          )}
        />
      </Modal.Content>
      <Modal.Controls setVisible={closeModal}>
        <Button status="SECONDARY" onClick={handleClipboard}>
          <FiCopy size={18} /> Clipboard
        </Button>
      </Modal.Controls>
    </Modal>
  );
};
