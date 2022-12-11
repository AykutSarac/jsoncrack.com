import React from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  AiOutlineDelete,
  AiOutlineSave,
  AiOutlineFileAdd,
  AiOutlineEdit,
} from "react-icons/ai";
import { CgArrowsMergeAltH, CgArrowsShrinkH } from "react-icons/cg";
import { FiDownload } from "react-icons/fi";
import { MdCenterFocusWeak } from "react-icons/md";
import { TiFlowMerge } from "react-icons/ti";
import {
  VscAccount,
  VscCloud,
  VscCollapseAll,
  VscExpandAll,
  VscSettingsGear,
} from "react-icons/vsc";
import { Tooltip } from "src/components/Tooltip";
import useConfig from "src/store/useConfig";
import useGraph from "src/store/useGraph";
import useModal from "src/store/useModal";
import { getNextDirection } from "src/utils/getNextDirection";
import styled from "styled-components";

const StyledSidebar = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  padding: 4px;
  border-right: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};

  @media only screen and (max-width: 768px) {
    flex-direction: row;
    width: 100%;
  }
`;

const StyledElement = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  width: fit-content;
  color: ${({ theme }) => theme.SIDEBAR_ICONS};
  cursor: pointer;

  svg {
    padding: 12px 8px;
    vertical-align: middle;
  }

  a {
    display: flex;
  }

  &:hover :is(a, svg) {
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
  }

  @media only screen and (max-width: 768px) {
    font-size: 22px;

    svg {
      padding: 8px 4px;
      vertical-align: middle;
    }
  }
`;

const StyledText = styled.span<{ secondary?: boolean }>`
  color: ${({ theme, secondary }) =>
    secondary ? theme.INTERACTIVE_HOVER : theme.ORANGE};
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

  .mobile {
    display: none;
  }

  @media only screen and (max-width: 768px) {
    justify-content: space-evenly;
    flex-direction: row;

    .mobile {
      display: initial;
    }

    .desktop {
      display: none;
    }
  }
`;

const StyledBottomWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const StyledLogo = styled.a`
  color: ${({ theme }) => theme.FULL_WHITE};
  padding: 8px 4px;
  border-bottom: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};

  @media only screen and (max-width: 768px) {
    border-bottom: 0;
  }
`;

function rotateLayout(direction: "LEFT" | "RIGHT" | "DOWN" | "UP") {
  if (direction === "LEFT") return 90;
  if (direction === "UP") return 180;
  if (direction === "RIGHT") return 270;
  return 360;
}

export const Sidebar: React.FC = () => {
  const setVisible = useModal(state => state.setVisible);
  const getJson = useGraph(state => state.getJson);
  const setDirection = useGraph(state => state.setDirection);
  const setConfig = useConfig(state => state.setConfig);
  const centerView = useConfig(state => state.centerView);
  const collapseGraph = useGraph(state => state.collapseGraph);
  const expandGraph = useGraph(state => state.expandGraph);

  const graphCollapsed = useGraph(state => state.graphCollapsed);
  const direction = useGraph(state => state.direction);
  const foldNodes = useConfig(state => state.foldNodes);
  const fullscreen = useConfig(state => state.fullscreen);

  const handleSave = () => {
    const a = document.createElement("a");
    const file = new Blob([getJson()], { type: "text/plain" });

    a.href = window.URL.createObjectURL(file);
    a.download = "jsoncrack.json";
    a.click();
  };

  const toggleFoldNodes = () => {
    setConfig("foldNodes", !foldNodes);
    toast(`${foldNodes ? "Unfolded" : "Folded"} nodes`);
  };

  const toggleDirection = () => {
    const nextDirection = getNextDirection(direction);
    setDirection(nextDirection);
  };

  const toggleExpandCollapseGraph = () => {
    if (graphCollapsed) expandGraph();
    else collapseGraph();

    toast(`${graphCollapsed ? "Expanded" : "Collapsed"} graph.`);
  };

  return (
    <StyledSidebar>
      <StyledTopWrapper>
        <Link passHref href="/">
          <StyledElement as={StyledLogo}>
            <StyledText>J</StyledText>
            <StyledText secondary>C</StyledText>
          </StyledElement>
        </Link>

        <Tooltip className="mobile" title="Edit JSON">
          <StyledElement onClick={() => setConfig("fullscreen", !fullscreen)}>
            <AiOutlineEdit />
          </StyledElement>
        </Tooltip>

        <Tooltip title="Import File">
          <StyledElement onClick={() => setVisible("import")(true)}>
            <AiOutlineFileAdd />
          </StyledElement>
        </Tooltip>

        <Tooltip title="Rotate Layout">
          <StyledElement onClick={toggleDirection}>
            <StyledFlowIcon rotate={rotateLayout(direction)} />
          </StyledElement>
        </Tooltip>

        <Tooltip className="mobile" title="Center View">
          <StyledElement onClick={centerView}>
            <MdCenterFocusWeak />
          </StyledElement>
        </Tooltip>

        <Tooltip
          className="desktop"
          title={foldNodes ? "Unfold Nodes" : "Fold Nodes"}
        >
          <StyledElement onClick={toggleFoldNodes}>
            {foldNodes ? <CgArrowsShrinkH /> : <CgArrowsMergeAltH />}
          </StyledElement>
        </Tooltip>

        <Tooltip
          className="desktop"
          title={graphCollapsed ? "Expand Graph" : "Collapse Graph"}
        >
          <StyledElement onClick={toggleExpandCollapseGraph}>
            {graphCollapsed ? <VscExpandAll /> : <VscCollapseAll />}
          </StyledElement>
        </Tooltip>

        <Tooltip className="desktop" title="Download JSON">
          <StyledElement onClick={handleSave}>
            <AiOutlineSave />
          </StyledElement>
        </Tooltip>

        <Tooltip className="mobile" title="Download Image">
          <StyledElement onClick={() => setVisible("download")(true)}>
            <FiDownload />
          </StyledElement>
        </Tooltip>

        <Tooltip title="Clear JSON">
          <StyledElement onClick={() => setVisible("clear")(true)}>
            <AiOutlineDelete />
          </StyledElement>
        </Tooltip>

        <Tooltip className="desktop" title="View Cloud">
          <StyledElement onClick={() => setVisible("cloud")(true)}>
            <VscCloud />
          </StyledElement>
        </Tooltip>
      </StyledTopWrapper>
      <StyledBottomWrapper>
        <Tooltip title="Account">
          <StyledElement onClick={() => setVisible("account")(true)}>
            <VscAccount />
          </StyledElement>
        </Tooltip>
        <Tooltip title="Settings">
          <StyledElement onClick={() => setVisible("settings")(true)}>
            <VscSettingsGear />
          </StyledElement>
        </Tooltip>
      </StyledBottomWrapper>
    </StyledSidebar>
  );
};
