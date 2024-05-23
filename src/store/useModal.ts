import { create } from "zustand";
import type { Modal } from "src/containers/Modals";
import useUser from "./useUser";

type ModalState = {
  [key in Modal]: boolean;
};

interface ModalActions {
  setVisible: (modal: Modal) => (visible: boolean) => void;
}

const initialStates: ModalState = {
  clear: false,
  cloud: false,
  download: false,
  import: false,
  account: false,
  node: false,
  share: false,
  login: false,
  upgrade: false,
  jwt: false,
  schema: false,
  review: false,
  jq: false,
  type: false,
};

const authModals: Modal[] = ["cloud", "account"];

const useModal = create<ModalState & ModalActions>()(set => ({
  ...initialStates,
  setVisible: modal => visible => {
    const user = useUser.getState();

    if (authModals.includes(modal) && !user.isAuthenticated) {
      return set({ login: true });
    }

    set({ [modal]: visible });
  },
}));

export default useModal;
