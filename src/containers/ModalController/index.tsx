import React from "react";
import { AccountModal } from "src/containers/Modals/AccountModal";
import { ClearModal } from "src/containers/Modals/ClearModal";
import { CloudModal } from "src/containers/Modals/CloudModal";
import { DownloadModal } from "src/containers/Modals/DownloadModal";
import { ImportModal } from "src/containers/Modals/ImportModal";
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
      <AccountModal visible={state.account} setVisible={setVisible("account")} />
      <ShareModal visible={state.share} setVisible={setVisible("share")} />
    </>
  );
};
