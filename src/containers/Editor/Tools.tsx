import React from "react";
import { AiOutlineFullscreen, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import { MdCenterFocusWeak } from "react-icons/md";
import { SearchInput } from "src/components/SearchInput";
import useConfig from "src/store/useConfig";
import styled from "styled-components";
import { DownloadModal } from "../Modals/DownloadModal";

export const StyledTools = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-direction: row-reverse;
  height: 28px;
  padding: 4px 16px;
  background: ${({ theme }) => theme.BACKGROUND_PRIMARY};
  color: ${({ theme }) => theme.SILVER};
  box-shadow: 0 1px 0px ${({ theme }) => theme.BACKGROUND_TERTIARY};
  z-index: 1;

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
  padding: 6px;
  border-radius: 3px;

  &:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0 0);
  }

  &:hover {
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
    opacity: 1;
    box-shadow: none;
  }
`;

export const Tools: React.FC = () => {
  const [isDownloadVisible, setDownloadVisible] = React.useState(false);

  const hideEditor = useConfig(state => state.hideEditor);
  const setConfig = useConfig(state => state.setConfig);

  const zoomIn = useConfig(state => state.zoomIn);
  const zoomOut = useConfig(state => state.zoomOut);
  const centerView = useConfig(state => state.centerView);
  const toggleEditor = () => setConfig("hideEditor", !hideEditor);

  return (
    <>
      <StyledTools>
        <StyledToolElement aria-label="fullscreen" onClick={toggleEditor}>
          <AiOutlineFullscreen />
        </StyledToolElement>
        <SearchInput />
        <StyledToolElement
          aria-label="save"
          onClick={() => setDownloadVisible(true)}
        >
          <FiDownload />
        </StyledToolElement>
        <StyledToolElement aria-label="center canvas" onClick={centerView}>
          <MdCenterFocusWeak />
        </StyledToolElement>
        <StyledToolElement aria-label="zoom out" onClick={zoomOut}>
          <AiOutlineMinus />
        </StyledToolElement>
        <StyledToolElement aria-label="zoom in" onClick={zoomIn}>
          <AiOutlinePlus />
        </StyledToolElement>
      </StyledTools>
      <DownloadModal visible={isDownloadVisible} setVisible={setDownloadVisible} />
    </>
  );
};
