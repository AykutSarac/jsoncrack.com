import React from "react";
import {
  AiOutlineFullscreen,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { TiFlowMerge } from "react-icons/ti";
import { MdCenterFocusWeak } from "react-icons/md";
import { CgArrowsMergeAltH, CgArrowsShrinkH } from "react-icons/cg";
import toast from "react-hot-toast";
import { CanvasDirection } from "reaflow";
import { SearchInput } from "src/components/SearchInput";
import styled from "styled-components";
import { getNextLayout } from "src/containers/Editor/LiveEditor/helpers";
import useConfig from "src/hooks/store/useConfig";
import shallow from "zustand/shallow";
import { DownloadModal } from "../Modals/DownloadModal";
import useStored from "src/hooks/store/useStored";

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

  @media only screen and (max-width: 768px) {
    display: none;
  }
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

const Divider = styled.span`
  height: 100%;
  width: 1px;
  background: ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
`;

const StyledFlowIcon = styled(TiFlowMerge)<{ rotate: number }>`
  transform: rotate(${({ rotate }) => `${rotate}deg`});
`;

function rotateLayout(layout: CanvasDirection) {
  if (layout === "LEFT") return 90;
  if (layout === "UP") return 180;
  if (layout === "RIGHT") return 270;
  return 360;
}

export const Tools: React.FC = () => {
  const [isDownloadVisible, setDownloadVisible] = React.useState(false);
  const lightmode = useStored((state) => state.lightmode);
  const setLightTheme = useStored((state) => state.setLightTheme);

  const [performanceMode, layout, expand, hideEditor] = useConfig(
    (state) => [
      state.performanceMode,
      state.layout,
      state.expand,
      state.hideEditor,
    ],
    shallow
  );

  const setConfig = useConfig((state) => state.setConfig);

  const zoomIn = useConfig((state) => state.zoomIn);
  const zoomOut = useConfig((state) => state.zoomOut);
  const centerView = useConfig((state) => state.centerView);
  const toggleEditor = () => setConfig("hideEditor", !hideEditor);
  const toggleTheme = () => setLightTheme(!lightmode);
  const toggleLayout = () => {
    const nextLayout = getNextLayout(layout);
    setConfig("layout", nextLayout);
  };

  const toggleExpandCollapse = () => {
    setConfig("expand", !expand);
    toast(`${expand ? "Collapsed" : "Expanded"} nodes.`);
  };

  return (
    <StyledTools>
      <StyledToolElement aria-label="fullscreen" onClick={toggleEditor}>
        <AiOutlineFullscreen />
      </StyledToolElement>
      <StyledToolElement aria-label="switch theme" onClick={toggleTheme}>
        {lightmode ? <HiOutlineMoon /> : <HiOutlineSun />}
      </StyledToolElement>
      {!performanceMode && <SearchInput />}

      {!performanceMode && (
        <StyledToolElement
          aria-label="save"
          onClick={() => setDownloadVisible(true)}
        >
          <FiDownload />
        </StyledToolElement>
      )}
      <Divider />
      <StyledToolElement
        aria-label={expand ? "shrink nodes" : "expand nodes"}
        onClick={toggleExpandCollapse}
      >
        {expand ? <CgArrowsMergeAltH /> : <CgArrowsShrinkH />}
      </StyledToolElement>
      <StyledToolElement aria-label="toggle layout" onClick={toggleLayout}>
        <StyledFlowIcon rotate={rotateLayout(layout)} />
      </StyledToolElement>
      <Divider />
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
    </StyledTools>
  );
};
