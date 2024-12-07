import React from "react";
import type { ModalProps } from "@mantine/core";
import * as ModalComponents from "src/features/modals";
import useModal from "src/store/useModal";

const modalNames = Object.keys(ModalComponents);
const modals = Object.freeze(modalNames) as Extract<keyof typeof ModalComponents, string>[];

export type Modal = (typeof modals)[number];
type ModalComponent = {
  key: Modal;
  component: React.FC<ModalProps & any>;
};

export const modalComponents: ModalComponent[] = modals.map(modal => ({
  key: modal,
  component: ModalComponents[modal],
}));

const ModalController = () => {
  const setVisible = useModal(state => state.setVisible);
  const modalStates = useModal(state => modalComponents.map(modal => state[modal.key]));

  return (
    <>
      {modalComponents.map(({ key, component }, index) => {
        const ModalComponent = component;
        const opened = modalStates[index];

        return <ModalComponent key={key} opened={opened} onClose={() => setVisible(key, false)} />;
      })}
    </>
  );
};

export default ModalController;
