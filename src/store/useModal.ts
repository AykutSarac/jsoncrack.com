import { create } from "zustand";
import { type Modal, modalComponents } from "src/features/modals/ModalController";

interface ModalActions {
  setVisible: (name: Modal, open: boolean) => void;
}

type ModalState = Record<Modal, boolean>;

const initialStates: ModalState = modalComponents.reduce(
  (acc, { key }) => ({ ...acc, [key]: false }),
  {} as ModalState
);

const useModal = create<ModalState & ModalActions>()(set => ({
  ...initialStates,
  setVisible: (name, open) => set({ [name]: open }),
}));

export default useModal;
