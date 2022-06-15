import React from "react";
import toast from "react-hot-toast";
import { Button } from "src/components/Button";
import { Modal, ModalProps } from "src/components/Modal";
import { useConfig } from "src/hocs/config";
import { ConfigActionType } from "src/reducer/reducer";

export const ClearModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const { dispatch } = useConfig();

  const handleClear = () => {
    dispatch({ type: ConfigActionType.SET_JSON, payload: "{}" });
    toast.success(`Cleared JSON and removed from memory.`);
    setVisible(false);
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Clear JSON</Modal.Header>
      <Modal.Content>Are you sure you want to clear JSON?</Modal.Content>
      <Modal.Controls setVisible={setVisible}>
        <Button status="DANGER" onClick={handleClear}>
          Confirm
        </Button>
      </Modal.Controls>
    </Modal>
  );
};
