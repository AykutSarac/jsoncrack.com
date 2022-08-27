import React from "react";
import {
  AiOutlineFullscreen,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { MdCenterFocusWeak } from "react-icons/md";
import { SearchInput } from "src/components/SearchInput";
import styled from "styled-components";
import useConfig from "src/hooks/store/useConfig";
import shallow from "zustand/shallow";
import { DownloadModal } from "../Modals/DownloadModal";
import useStored from "src/hooks/store/useStored";
import { TbSettings } from "react-icons/tb";
import { Settings } from "./Settings";

export const StyledTools = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-direction: row-reverse;
  height: 28px;
  padding: 4px 16px;
  background: ${({ theme }) => theme.BACKGROUND_PRIMARY};
  color: ${({ theme }) => theme.SILVER};

  box-shadow: 0 1px 0px ${({ theme }) => theme.BACKGROUND_TERTIARY};
`;

const StyledToolElement = styled.button`
  display: grid;
  place-content: center;
  font-size: 20px;
  background: none;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};

  &:hover {
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
    opacity: 1;
    box-shadow: none;
  }
`;

export const Tools: React.FC = () => {
  const [settingsVisible, setSettingsVisible] = React.useState(false);
  const [isDownloadVisible, setDownloadVisible] = React.useState(false);
  const lightmode = useStored((state) => state.lightmode);
  const setLightTheme = useStored((state) => state.setLightTheme);

  const [performanceMode, hideEditor] = useConfig(
    (state) => [state.performanceMode, state.hideEditor],
    shallow
  );

  const setConfig = useConfig((state) => state.setConfig);

  const zoomIn = useConfig((state) => state.zoomIn);
  const zoomOut = useConfig((state) => state.zoomOut);
  const centerView = useConfig((state) => state.centerView);
  const toggleEditor = () => setConfig("hideEditor", !hideEditor);
  const toggleTheme = () => setLightTheme(!lightmode);

  return (
    <StyledTools>
      <StyledToolElement aria-label="fullscreen" onClick={toggleEditor}>
        <AiOutlineFullscreen />
      </StyledToolElement>
      <StyledToolElement
        aria-label="settings"
        onClick={() => setSettingsVisible(true)}
      >
        <TbSettings />
      </StyledToolElement>
      <StyledToolElement aria-label="switch theme" onClick={toggleTheme}>
        {lightmode ? <HiOutlineMoon /> : <HiOutlineSun />}
      </StyledToolElement>
      {!performanceMode && <SearchInput />}

      {!performance && (
        <StyledToolElement
          aria-label="save"
          onClick={() => setDownloadVisible(true)}
        >
          <FiDownload />
        </StyledToolElement>
      )}
      <StyledToolElement aria-label="center canvas" onClick={centerView}>
        <MdCenterFocusWeak />
      </StyledToolElement>
      <StyledToolElement aria-label="zoom out" onClick={zoomOut}>
        <AiOutlineMinus />
      </StyledToolElement>
      <StyledToolElement aria-label="zoom in" onClick={zoomIn}>
        <AiOutlinePlus />
      </StyledToolElement>
      <DownloadModal
        visible={isDownloadVisible}
        setVisible={setDownloadVisible}
      />
      <Settings visible={settingsVisible} setVisible={setSettingsVisible} />
    </StyledTools>
  );
};
