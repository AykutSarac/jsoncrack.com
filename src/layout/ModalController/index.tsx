import React from "react";
import { ModalProps } from "@mantine/core";
import * as Modals from "src/containers/Modals";
import { Modal } from "src/containers/Modals";
import useModal from "src/store/useModal";
import { EditorMantine } from "../EditorMantine";

type ModalComponent = { key: Modal; component: React.FC<ModalProps> };

const modalComponents: ModalComponent[] = [
  { key: "import", component: Modals.ImportModal },
  { key: "clear", component: Modals.ClearModal },
  { key: "download", component: Modals.DownloadModal },
  { key: "settings", component: Modals.SettingsModal },
  { key: "cloud", component: Modals.CloudModal },
  { key: "account", component: Modals.AccountModal },
  { key: "premium", component: Modals.PremiumModal },
  { key: "login", component: Modals.LoginModal },
  { key: "share", component: Modals.ShareModal },
  { key: "jwt", component: Modals.JWTModal },
  { key: "node", component: Modals.NodeModal },
  { key: "schema", component: Modals.SchemaModal },
  { key: "cancelPremium", component: Modals.CancelPremiumModal },
];

const ModalController = () => {
  const setVisible = useModal(state => state.setVisible);
  const modalStates = useModal(state => modalComponents.map(modal => state[modal.key]));

  return (
    <EditorMantine>
      {modalComponents.map(({ key, component }, index) => {
        const ModalComponent = component;
        const opened = modalStates[index];

        return <ModalComponent key={key} opened={opened} onClose={() => setVisible(key)(false)} />;
      })}
    </EditorMantine>
  );
};

export default ModalController;
