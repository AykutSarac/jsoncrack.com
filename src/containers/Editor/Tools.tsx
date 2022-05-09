import React from "react";
import { saveAsPng } from "save-html-as-image";
import { copyBlobToClipboard } from "copy-image-clipboard";
import * as htmlToImage from "html-to-image";
import {
  AiOutlineFullscreen,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineCopy,
} from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { MdCenterFocusWeak } from "react-icons/md";
import { SearchInput } from "src/containers/SearchInput";
import { useConfig } from "src/hocs/config";
import { ConfigActionType } from "src/reducer/reducer";
import styled from "styled-components";
import toast from "react-hot-toast";

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
  const { settings, dispatch } = useConfig();

  const zoomIn = () => dispatch({ type: ConfigActionType.ZOOM_IN });

  const zoomOut = () => dispatch({ type: ConfigActionType.ZOOM_OUT });

  const centerView = () => dispatch({ type: ConfigActionType.CENTER_VIEW });

  const toggleEditor = () => dispatch({ type: ConfigActionType.TOGGLE_DOCK });

  const toggleTheme = () => dispatch({ type: ConfigActionType.TOGGLE_THEME });

  const exportAsImage = () => {
    saveAsPng(document.querySelector("svg[id*='ref']"), {
      filename: "jsonvisio.com",
      printDate: true,
    });
  };

  const copyToClipboard = () => {
    const imageElement: any = document.querySelector("svg[id*='ref']");

    htmlToImage
      .toBlob(imageElement)
      .then((blob: any) => {
        return copyBlobToClipboard(blob);
      })
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((e) => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <StyledTools>
      <StyledToolElement aria-label="fullscreen" onClick={toggleEditor}>
        <AiOutlineFullscreen />
      </StyledToolElement>
      <StyledToolElement aria-label="switch theme" onClick={toggleTheme}>
        {settings.lightmode ? <HiOutlineMoon /> : <HiOutlineSun />}
      </StyledToolElement>
      <SearchInput />
      <StyledToolElement aria-label="save" onClick={exportAsImage}>
        <FiDownload />
      </StyledToolElement>
      <StyledToolElement aria-label="save" onClick={copyToClipboard}>
        <AiOutlineCopy />
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
  );
};
