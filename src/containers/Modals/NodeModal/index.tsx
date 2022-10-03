import React from "react";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import useGraph from "src/hooks/store/useGraph";
import styled from "styled-components";
import { parser } from "src/utils/jsonParser";
import { isValidJson } from "src/utils/isValidJson";

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

export const NodeModal = ({ selectedNode, visible, closeModal }: NodeModalProps) => {
  const setGraphValue = useGraph(state => state.setGraphValue);
  const nodes = useGraph(state => state.nodes);
  const nodeData = Array.isArray(selectedNode.text)
    ? Object.fromEntries(selectedNode.text)
    : selectedNode.text;
  const [text, setText] = React.useState(nodeData);
    
  const handleClipboard = () => {
    toast.success("Content copied to clipboard!");
    navigator.clipboard.writeText(JSON.stringify(text));
    closeModal();
  };
  
  const update = (newText:string) => {
    if(isValidJson(newText)){
      const parsedNode = parser(newText);
      const parsedText = parsedNode?.nodes[0]?.text;
      Array.isArray(parsedText)
        ? setText(Object.fromEntries(parsedText))
        : setText(parsedText);
      const updatedNode = {...selectedNode, text: parsedText}  
      setGraphValue("nodes", [...nodes.filter(({id}) => id !== selectedNode.id), updatedNode]);        
    };
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
          onChange={(e)=> update(e.target.value)}
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
