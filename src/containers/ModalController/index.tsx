import React from "react";
import { AccountModal } from "src/containers/Modals/AccountModal";
import { ClearModal } from "src/containers/Modals/ClearModal";
import { CloudModal } from "src/containers/Modals/CloudModal";
import { DownloadModal } from "src/containers/Modals/DownloadModal";
import { ImportModal } from "src/containers/Modals/ImportModal";
import { LoginModal } from "src/containers/Modals/LoginModal";
import { SettingsModal } from "src/containers/Modals/SettingsModal";
import { ShareModal } from "src/containers/Modals/ShareModal";
import useModal from "src/store/useModal";
import { shallow } from "zustand/shallow";

export const ModalController = () => {
  const setVisible = useModal(state => state.setVisible);

  const [
    importModal,
    clearModal,
    downloadModal,
    settingsModal,
    cloudModal,
    accountModal,
    loginModal,
    shareModal,
  ] = useModal(
    state => [
      state.import,
      state.clear,
      state.download,
      state.settings,
      state.cloud,
      state.account,
      state.login,
      state.share,
    ],
    shallow
  );

  return (
    <>
      <ImportModal visible={importModal} setVisible={setVisible("import")} />
      <ClearModal visible={clearModal} setVisible={setVisible("clear")} />
      <DownloadModal visible={downloadModal} setVisible={setVisible("download")} />
      <SettingsModal visible={settingsModal} setVisible={setVisible("settings")} />
      <CloudModal visible={cloudModal} setVisible={setVisible("cloud")} />
      <AccountModal visible={accountModal} setVisible={setVisible("account")} />
      <LoginModal visible={loginModal} setVisible={setVisible("login")} />
      <ShareModal visible={shareModal} setVisible={setVisible("share")} />
    </>
  );
};
