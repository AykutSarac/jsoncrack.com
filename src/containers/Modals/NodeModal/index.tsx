import React from "react";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import useGraph from "src/hooks/store/useGraph";
import styled from "styled-components";
import { getPathToNode } from "../../../utils/getPathToNode";

interface NodeModalProps {
  selectedNode: NodeData;
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
  selectedNode: { text, id },
  visible,
  closeModal,
}: NodeModalProps) => {
  const { nodes, edges } = useGraph();
  const nodeData = Array.isArray(text) ? Object.fromEntries(text) : text;

  const handleClipboard = content => {
    toast.success("Content copied to clipboard!");
    navigator.clipboard.writeText(JSON.stringify(content));
    closeModal();
  };

  const nodeDataToClipboard = () => handleClipboard(nodeData);
  const parentNodesDataToClipboard = () => handleClipboard(getPathToNode(nodes, edges, id));

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
          readOnly
        />
      </Modal.Content>
      <Modal.Controls setVisible={closeModal}>
        <Button status="SECONDARY" onClick={parentNodesDataToClipboard}>
          <FiCopy size={18} /> Parent Nodes to Clipboard
        </Button>
        <Button status="SECONDARY" onClick={nodeDataToClipboard}>
          <FiCopy size={18} /> Clipboard
        </Button>
      </Modal.Controls>
    </Modal>
  );
};
