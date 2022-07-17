import React from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import styled from "styled-components";
import { CanvasDirection } from "reaflow";
import { TiFlowMerge } from "react-icons/ti";
import { RiPatreonFill } from "react-icons/ri";
import {
  CgArrowsMergeAltH,
  CgArrowsShrinkH,
  CgPerformance,
} from "react-icons/cg";
import {
  AiOutlineDelete,
  AiFillGithub,
  AiOutlineTwitter,
  AiOutlineSave,
  AiOutlineFileAdd,
  AiOutlineLink,
} from "react-icons/ai";

import { Tooltip } from "src/components/Tooltip";
import { ConfigActionType } from "src/reducer/reducer";
import { useConfig } from "src/hocs/config";
import { useRouter } from "next/router";
import { ImportModal } from "src/containers/ImportModal";
import { ClearModal } from "src/containers/ClearModal";
import { ShareModal } from "src/containers/ShareModal";
import { IoAlertCircleSharp } from "react-icons/io5";

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

const StyledElement = styled.div<{ beta?: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 28px;
  font-weight: 600;
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
      right: 0;
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
    padding: 8px;
    vertical-align: middle;
  }

  a {
    display: flex;
  }

  &:hover :is(a, svg) {
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
  }
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

  & > div:nth-child(n + 1) {
    border-bottom: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
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
  const { json, settings, dispatch } = useConfig();
  const router = useRouter();
  const [uploadVisible, setUploadVisible] = React.useState(false);
  const [clearVisible, setClearVisible] = React.useState(false);
  const [shareVisible, setShareVisible] = React.useState(false);

  const handleSave = () => {
    const a = document.createElement("a");
    const file = new Blob([json], { type: "text/plain" });

    a.href = window.URL.createObjectURL(file);
    a.download = "jsonvisio.json";
    a.click();
  };

  const toggleExpandCollapse = () => {
    dispatch({ type: ConfigActionType.TOGGLE_EXPAND });
    toast(`${settings.expand ? "Collapsed" : "Expanded"} nodes.`);
  };

  const togglePerformance = () => {
    const toastMsg = settings.performance
      ? "Disabled Performance Mode\nSearch Node & Save Image enabled."
      : "Enabled Performance Mode\nSearch Node & Save Image disabled.";

    toast(toastMsg, {
      icon: <StyledAlertIcon size={36} />,
      duration: 3000,
    });

    dispatch({ type: ConfigActionType.TOGGLE_PERFORMANCE });
  };

  return (
    <StyledSidebar>
      <StyledTopWrapper>
        <Link passHref href="/">
          <StyledElement onClick={() => router.push("/")}>
            <StyledLogo>
              <StyledText>J</StyledText>
              <StyledText secondary>V</StyledText>
            </StyledLogo>
          </StyledElement>
        </Link>
        <Tooltip title="Import File">
          <StyledElement onClick={() => setUploadVisible(true)}>
            <AiOutlineFileAdd />
          </StyledElement>
        </Tooltip>
        <Tooltip title="Rotate Layout">
          <StyledElement
            onClick={() => dispatch({ type: ConfigActionType.TOGGLE_LAYOUT })}
          >
            <StyledFlowIcon rotate={rotateLayout(settings.layout)} />
          </StyledElement>
        </Tooltip>
        <Tooltip title={settings.expand ? "Shrink Nodes" : "Expand Nodes"}>
          <StyledElement
            title="Toggle Expand/Collapse"
            onClick={toggleExpandCollapse}
          >
            {settings.expand ? <CgArrowsMergeAltH /> : <CgArrowsShrinkH />}
          </StyledElement>
        </Tooltip>
        <Tooltip title="Clear JSON">
          <StyledElement onClick={() => setClearVisible(true)}>
            <AiOutlineDelete />
          </StyledElement>
        </Tooltip>
        <Tooltip title="Save JSON">
          <StyledElement onClick={handleSave}>
            <AiOutlineSave />
          </StyledElement>
        </Tooltip>
        <Tooltip title="Share">
          <StyledElement onClick={() => setShareVisible(true)}>
            <AiOutlineLink />
          </StyledElement>
        </Tooltip>
        <Tooltip
          title={`${
            settings.performance ? "Disable" : "Enable"
          } Performance Mode (Beta)`}
        >
          <StyledElement onClick={togglePerformance} beta>
            <CgPerformance
              color={settings.performance ? "#0073FF" : undefined}
            />
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
          <Link href="https://www.patreon.com/aykutsarac">
            <a aria-label="Patreon" rel="me" target="_blank">
              <RiPatreonFill />
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
