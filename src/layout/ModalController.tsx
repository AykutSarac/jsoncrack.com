import React from "react";
import type { ModalProps } from "@mantine/core";
import * as Modals from "src/containers/Modals";
import type { Modal } from "src/containers/Modals";
import useModal from "src/store/useModal";

type ModalComponent = { key: Modal; component: React.FC<ModalProps> };

const modalComponents: ModalComponent[] = [
  { key: "import", component: Modals.ImportModal },
  { key: "download", component: Modals.DownloadModal },
  { key: "cloud", component: Modals.CloudModal },
  { key: "account", component: Modals.AccountModal },
  { key: "upgrade", component: Modals.UpgradeModal },
  { key: "login", component: Modals.LoginModal },
  { key: "jwt", component: Modals.JWTModal },
  { key: "node", component: Modals.NodeModal },
  { key: "schema", component: Modals.SchemaModal },
  { key: "jq", component: Modals.JQModal },
  { key: "type", component: Modals.TypeModal },
  { key: "jpath", component: Modals.JPathModal },
  { key: "notice", component: Modals.NoticeModal },
];

const ModalController = () => {
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

export default ModalController;
