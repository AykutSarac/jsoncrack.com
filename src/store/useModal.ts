import { create } from "zustand";
import { Modal } from "src/containers/Modals";
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
  settings: false,
  share: false,
  login: false,
  premium: false,
  jwt: false,
  schema: false,
  cancelPremium: false,
};

const authModals: Modal[] = ["cloud", "share", "account", "schema"];
const premiumModals: Modal[] = ["schema"];

const useModal = create<ModalState & ModalActions>()(set => ({
  ...initialStates,
  setVisible: modal => visible => {
    const user = useUser.getState();

    if (authModals.includes(modal) && !user.isAuthenticated) {
      return set({ login: true });
    } else if (premiumModals.includes(modal) && !user.premium) {
      return set({ premium: true });
    }

    set({ [modal]: visible });
  },
}));

export default useModal;
