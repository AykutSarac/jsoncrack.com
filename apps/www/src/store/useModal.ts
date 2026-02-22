import { createWithEqualityFn as create } from "zustand/traditional";
import { type ModalName, modals } from "../features/modals/modalTypes";

interface ModalActions {
  setVisible: (name: ModalName, open: boolean) => void;
}

type ModalState = Record<ModalName, boolean>;

const initialStates: ModalState = modals.reduce((acc, modal) => {
  acc[modal] = false;
  return acc;
}, {} as ModalState);

export const useModal = create<ModalState & ModalActions>()(set => ({
  ...initialStates,
  setVisible: (name, open) => {
    set({ [name]: open });
  },
}));
