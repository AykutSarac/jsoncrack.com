// TODO: handle all modals here
// put all modals into a global place
// display auth modal for unauthorized modal access actions
import create from "zustand";
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
  login: false,
  node: false,
  settings: false,
  share: false,
};

type ModalType = keyof typeof initialStates;

const authModals: ModalType[] = ["cloud", "share"];

export type ModalStates = typeof initialStates;

const useModal = create<ModalStates & ModalActions>()(set => ({
  ...initialStates,
  setVisible: modal => visible => {
    if (authModals.includes(modal) && !useUser.getState().isAuthorized) {
      return set({ login: true });
    }

    set({ [modal]: visible });
  },
}));

export default useModal;
