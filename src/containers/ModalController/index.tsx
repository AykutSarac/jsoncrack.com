import React from "react";
import { ClearModal } from "src/containers/Modals/ClearModal";
import { CloudModal } from "src/containers/Modals/CloudModal";
import { DownloadModal } from "src/containers/Modals/DownloadModal";
import { ImportModal } from "src/containers/Modals/ImportModal";
import { LoginModal } from "src/containers/Modals/LoginModal";
import { SettingsModal } from "src/containers/Modals/SettingsModal";
import { ShareModal } from "src/containers/Modals/ShareModal";
import useModal from "src/store/useModal";

export const ModalController = () => {
  const setVisible = useModal(state => state.setVisible);
  const state = useModal(state => state);

  return (
    <>
      <ImportModal visible={state.import} setVisible={setVisible("import")} />
      <ClearModal visible={state.clear} setVisible={setVisible("clear")} />
      <DownloadModal visible={state.download} setVisible={setVisible("download")} />
      <SettingsModal visible={state.settings} setVisible={setVisible("settings")} />
      <CloudModal visible={state.cloud} setVisible={setVisible("cloud")} />
      <LoginModal visible={state.login} setVisible={setVisible("login")} />
      <ShareModal visible={state.share} setVisible={setVisible("share")} />
    </>
  );
};
