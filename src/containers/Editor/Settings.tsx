import React from "react";
import { Modal } from "src/components/Modal";
import Toggle from "src/components/Toggle";

export const Settings: React.FC<{
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ visible, setVisible }) => {
  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Settings</Modal.Header>
      <Modal.Content>
        <Toggle>Test The Toggle</Toggle>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible} />
    </Modal>
  );
};
