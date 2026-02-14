import React from "react";
import * as ModalComponents from ".";
import { useModal } from "../../store/useModal";
import { modals, type ModalName } from "./modalTypes";

const Modal = ({ modalKey }: { modalKey: ModalName }) => {
  const opened = useModal(state => state[modalKey]);
  const setVisible = useModal(state => state.setVisible);
  const ModalComponent = ModalComponents[modalKey];

  return <ModalComponent opened={opened} onClose={() => setVisible(modalKey, false)} />;
};

const ModalController = () => {
  return modals.map(modal => <Modal key={modal} modalKey={modal} />);
};

export default ModalController;
