import React from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import styled from "styled-components";
import { CanvasDirection } from "reaflow";
import { TiFlowMerge } from "react-icons/ti";
import {
  CgArrowsMergeAltH,
  CgArrowsShrinkH,
  CgPerformance,
} from "react-icons/cg";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import {
  AiOutlineDelete,
  AiFillGithub,
  AiOutlineTwitter,
  AiOutlineSave,
  AiOutlineFileAdd,
  AiOutlineLink,
} from "react-icons/ai";

import { Tooltip } from "src/components/Tooltip";
import { useRouter } from "next/router";
import { ImportModal } from "src/containers/Modals/ImportModal";
import { ClearModal } from "src/containers/Modals/ClearModal";
import { ShareModal } from "src/containers/Modals/ShareModal";
import { IoAlertCircleSharp } from "react-icons/io5";
import useConfig from "src/hooks/store/useConfig";
import { getNextLayout } from "src/containers/Editor/LiveEditor/helpers";
import { HiHeart } from "react-icons/hi";
import shallow from "zustand/shallow";

const StyledSidebar = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  padding: 4px;
  border-right: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
`;

const StyledElement = styled.div<{ beta?: boolean; isElementLogo?: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  text-align: center;
  font-size: 26px;
  font-weight: 600;
  padding: ${({ isElementLogo }) => (isElementLogo ? "0px" : "8px")};
  box-sizing: border-box;
  width: 100%;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  cursor: pointer;

  ${({ theme, beta }) =>
    beta &&
    `
    &::after {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      bottom: 0;
      left: 20px;
      content: 'Beta';
      font-size: 10px;
      font-weight: 500;
      background: ${theme.BLURPLE};
      border-radius: 4px;
      color: ${theme.FULL_WHITE};
      padding: 2px;
      height: 14px;
      z-index: 0;
    }
  `};

  svg {
    vertical-align: middle;
    position: relative;
  }

  a {
    display: flex;
  }

  &:hover :is(a, svg, span) {
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
  }
`;

const StyledNavElementText = styled.span`
  font-size: 14px;
  white-space: nowrap;
  flex: 1;
  text-align: left;
`;

const StyledText = styled.span<{ secondary?: boolean }>`
  color: ${({ theme, secondary }) =>
    secondary ? theme.INTERACTIVE_NORMAL : theme.ORANGE};
`;

const StyledFlowIcon = styled(TiFlowMerge)<{ rotate: number }>`
  transform: rotate(${({ rotate }) => `${rotate}deg`});
`;

const StyledTopWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
  & > div:nth-child(n + 1) {
    border-bottom: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  }
`;

const StyledNavExpandCollpaseButton = styled.div`
  position: absolute;
  right: -20px;
  top: 28px;
  z-index: 2;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  color: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  display: flex;

  &:hover {
    background-color: ${({ theme }) => theme.INTERACTIVE_HOVER};
    cursor: pointer;
  }
`;

const StyledBottomWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 100%;

  & > div,
  a:nth-child(0) {
    border-top: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  }
`;

const StyledLogo = styled.div`
  color: ${({ theme }) => theme.FULL_WHITE};
`;

function rotateLayout(layout: CanvasDirection) {
  if (layout === "LEFT") return 90;
  if (layout === "UP") return 180;
  if (layout === "RIGHT") return 270;
  return 360;
}

const StyledAlertIcon = styled(IoAlertCircleSharp)`
  color: ${({ theme }) => theme.ORANGE};
`;

export const Sidebar: React.FC = () => {
  const getJson = useConfig((state) => state.getJson);
  const setConfig = useConfig((state) => state.setConfig);
  const [uploadVisible, setUploadVisible] = React.useState(false);
  const [expandNav, setExpandNav] = React.useState(false);
  const [clearVisible, setClearVisible] = React.useState(false);
  const [shareVisible, setShareVisible] = React.useState(false);
  const { push } = useRouter();

  const [expand, performanceMode, layout] = useConfig(
    (state) => [state.expand, state.performanceMode, state.layout],
    shallow
  );

  const handleSave = () => {
    const a = document.createElement("a");
    const file = new Blob([getJson()], { type: "text/plain" });

    a.href = window.URL.createObjectURL(file);
    a.download = "jsonvisio.json";
    a.click();
  };

  const toggleExpandCollapse = () => {
    setConfig("expand", !expand);
    toast(`${expand ? "Collapsed" : "Expanded"} nodes.`);
  };

  const togglePerformance = () => {
    const toastMsg = performanceMode
      ? "Disabled Performance Mode\nSearch Node & Save Image enabled."
      : "Enabled Performance Mode\nSearch Node & Save Image disabled.";

    toast(toastMsg, {
      icon: <StyledAlertIcon size={36} />,
      duration: 3000,
    });

    setConfig("performanceMode", !performanceMode);
  };

  const toggleLayout = () => {
    const nextLayout = getNextLayout(layout);
    setConfig("layout", nextLayout);
  };

  return (
    <StyledSidebar>
      <StyledTopWrapper>
        <StyledNavExpandCollpaseButton
          onClick={() => setExpandNav((prev) => !prev)}
        >
          {expandNav ? (
            <BiChevronLeft size={"30px"} />
          ) : (
            <BiChevronRight size={"30px"} />
          )}
        </StyledNavExpandCollpaseButton>
        <Link passHref href="/">
          <StyledElement onClick={() => push("/")} isElementLogo={true}>
            <StyledLogo>
              <StyledText>{!expandNav ? "J" : "JSON "}</StyledText>
              <StyledText secondary>{!expandNav ? "V" : "Visio"}</StyledText>
            </StyledLogo>
          </StyledElement>
        </Link>
        <Tooltip title="Import File" disabled={expandNav}>
          <StyledElement onClick={() => setUploadVisible(true)}>
            <AiOutlineFileAdd />
            {expandNav && (
              <StyledNavElementText>Import File</StyledNavElementText>
            )}
          </StyledElement>
        </Tooltip>
        <Tooltip title="Rotate Layout" disabled={expandNav}>
          <StyledElement onClick={toggleLayout}>
            <StyledFlowIcon rotate={rotateLayout(layout)} />
            {expandNav && (
              <StyledNavElementText>Rotate Layout</StyledNavElementText>
            )}
          </StyledElement>
        </Tooltip>
        <Tooltip
          title={expand ? "Shrink Nodes" : "Expand Nodes"}
          disabled={expandNav}
        >
          <StyledElement
            title="Toggle Expand/Collapse"
            onClick={toggleExpandCollapse}
          >
            {expand ? <CgArrowsMergeAltH /> : <CgArrowsShrinkH />}
            {expandNav && (
              <StyledNavElementText>
                {expand ? "Shrink Nodes" : "Expand Nodes"}
              </StyledNavElementText>
            )}
          </StyledElement>
        </Tooltip>
        <Tooltip
          title={`${
            performanceMode ? "Disable" : "Enable"
          } Performance Mode (Beta)`}
          disabled={expandNav}
        >
          <StyledElement onClick={togglePerformance} beta>
            <CgPerformance color={performanceMode ? "#0073FF" : undefined} />
            {expandNav && (
              <StyledNavElementText>
                {performanceMode ? "Disable" : "Enable"} Performance Mode (Beta)
              </StyledNavElementText>
            )}
          </StyledElement>
        </Tooltip>
        <Tooltip title="Save JSON" disabled={expandNav}>
          <StyledElement onClick={handleSave}>
            <AiOutlineSave />
            {expandNav && (
              <StyledNavElementText>Save JSON</StyledNavElementText>
            )}
          </StyledElement>
        </Tooltip>
        <Tooltip title="Clear JSON" disabled={expandNav}>
          <StyledElement onClick={() => setClearVisible(true)}>
            <AiOutlineDelete />
            {expandNav && (
              <StyledNavElementText>Clear JSON</StyledNavElementText>
            )}
          </StyledElement>
        </Tooltip>
        <Tooltip title="Share" disabled={expandNav}>
          <StyledElement onClick={() => setShareVisible(true)}>
            <AiOutlineLink />
            {expandNav && <StyledNavElementText>Share</StyledNavElementText>}
          </StyledElement>
        </Tooltip>
      </StyledTopWrapper>
      <StyledBottomWrapper>
        <StyledElement>
          <Link href="https://twitter.com/aykutsarach">
            <a aria-label="Twitter" rel="me" target="_blank">
              <AiOutlineTwitter />
            </a>
          </Link>
        </StyledElement>
        <StyledElement>
          <Link href="https://github.com/AykutSarac/jsonvisio.com">
            <a aria-label="GitHub" rel="me" target="_blank">
              <AiFillGithub />
            </a>
          </Link>
        </StyledElement>
        <StyledElement>
          <Link href="https://github.com/sponsors/AykutSarac">
            <a aria-label="GitHub Sponsors" rel="me" target="_blank">
              <HiHeart />
            </a>
          </Link>
        </StyledElement>
      </StyledBottomWrapper>
      <ImportModal visible={uploadVisible} setVisible={setUploadVisible} />
      <ClearModal visible={clearVisible} setVisible={setClearVisible} />
      <ShareModal visible={shareVisible} setVisible={setShareVisible} />
    </StyledSidebar>
  );
};
