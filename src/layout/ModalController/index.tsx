import React from "react";
import { ModalProps } from "@mantine/core";
import {
  AccountModal,
  ClearModal,
  DownloadModal,
  ImportModal,
  JWTModal,
  LoginModal,
  Modal,
  NodeModal,
  PremiumModal,
  SchemaModal,
  SettingsModal,
  ShareModal,
  CancelPremiumModal,
} from "src/containers/Modals";
import { CloudModal } from "src/containers/Modals/CloudModal";
import useModal from "src/store/useModal";

type ModalComponent = { key: Modal; component: React.FC<ModalProps> };

const modalComponents: ModalComponent[] = [
  { key: "import", component: ImportModal },
  { key: "clear", component: ClearModal },
  { key: "download", component: DownloadModal },
  { key: "settings", component: SettingsModal },
  { key: "cloud", component: CloudModal },
  { key: "account", component: AccountModal },
  { key: "premium", component: PremiumModal },
  { key: "login", component: LoginModal },
  { key: "share", component: ShareModal },
  { key: "jwt", component: JWTModal },
  { key: "node", component: NodeModal },
  { key: "schema", component: SchemaModal },
  { key: "cancelPremium", component: CancelPremiumModal },
];

export const ModalController = () => {
  const setVisible = useModal(state => state.setVisible);
  const modalStates = useModal(state => modalComponents.map(modal => state[modal.key]));

  return (
    <>
      {modalComponents.map(({ key, component }, index) => {
        const ModalComponent = component;
        const opened = modalStates[index];

        return <ModalComponent key={key} opened={opened} onClose={() => setVisible(key)(false)} />;
      })}
    </>
  );
};
