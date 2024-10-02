import { create } from "zustand";
import type { Modal } from "src/containers/Modals";

type ModalState = {
  [key in Modal]: boolean;
};

interface ModalActions {
  setVisible: (modal: Modal) => (visible: boolean) => void;
}

const initialStates: ModalState = {
  download: false,
  import: false,
  node: false,
  upgrade: false,
  jwt: false,
  schema: false,
  jq: false,
  type: false,
  jpath: false,
};

const useModal = create<ModalState & ModalActions>()(set => ({
  ...initialStates,
  setVisible: modal => visible => set({ [modal]: visible }),
}));

export default useModal;
