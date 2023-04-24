import { create } from "zustand";
import useUser from "./useUser";

interface ModalActions {
  setVisible: (modal: keyof typeof initialStates) => (visible: boolean) => void;
}

const initialStates = {
  clear: false,
  cloud: false,
  download: false,
  goals: false,
  import: false,
  account: false,
  node: false,
  settings: false,
  share: false,
  login: false,
  premium: false,
  herowand: false,
};

type ModalType = keyof typeof initialStates;

const authModals: ModalType[] = ["cloud", "share", "account"];

export type ModalStates = typeof initialStates;

const useModal = create<ModalStates & ModalActions>()(set => ({
  ...initialStates,
  setVisible: modal => visible => {
    if (authModals.includes(modal) && !useUser.getState().isAuthenticated) {
      return set({ login: true });
    }

    set({ [modal]: visible });
  },
}));

export default useModal;
