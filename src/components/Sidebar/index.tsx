import React from "react";
import styled from "styled-components";
import { Tooltip } from "@mantine/core";
import toast from "react-hot-toast";
import { AiOutlineDelete, AiOutlineSave, AiOutlineFileAdd, AiOutlineEdit } from "react-icons/ai";
import { CgArrowsMergeAltH, CgArrowsShrinkH } from "react-icons/cg";
import { TiFlowMerge } from "react-icons/ti";
import {
  VscAccount,
  VscCloud,
  VscCollapseAll,
  VscExpandAll,
  VscSettingsGear,
} from "react-icons/vsc";
import useGraph from "src/store/useGraph";
import useJson from "src/store/useJson";
import useModal from "src/store/useModal";
import { getNextDirection } from "src/utils/getNextDirection";

const StyledSidebar = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  padding: 4px;
  border-right: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  width: 50px;
  text-align: center;

  @media only screen and (max-width: 768px) {
    flex-direction: row;
    width: 100%;
  }
`;

const StyledElement = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
  color: ${({ theme }) => theme.SIDEBAR_ICONS};
  width: 100%;

  svg {
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
  }
`;

const StyledText = styled.span<{ secondary?: boolean }>`
  color: ${({ theme, secondary }) => (secondary ? theme.INTERACTIVE_HOVER : theme.ORANGE)};
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
  border-bottom: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  width: 100%;

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

const SidebarButton: React.FC<{
  onClick: () => void;
  deviceDisplay?: "desktop" | "mobile";
  title: string;
  component: React.ReactNode;
}> = ({ onClick, deviceDisplay, title, component }) => {
  return (
    <Tooltip className={deviceDisplay} label={title} color="gray" position="right" withArrow>
      <StyledElement onClick={onClick}>{component}</StyledElement>
    </Tooltip>
  );
};

export const Sidebar: React.FC = () => {
  const setVisible = useModal(state => state.setVisible);
  const setDirection = useGraph(state => state.setDirection);
  const getJson = useJson(state => state.getJson);

  const collapseGraph = useGraph(state => state.collapseGraph);
  const expandGraph = useGraph(state => state.expandGraph);
  const toggleFold = useGraph(state => state.toggleFold);
  const toggleFullscreen = useGraph(state => state.toggleFullscreen);

  const direction = useGraph(state => state.direction);
  const foldNodes = useGraph(state => state.foldNodes);
  const fullscreen = useGraph(state => state.fullscreen);
  const graphCollapsed = useGraph(state => state.graphCollapsed);

  const handleSave = () => {
    const a = document.createElement("a");
    const file = new Blob([getJson()], { type: "text/plain" });

    a.href = window.URL.createObjectURL(file);
    a.download = "jsoncrack.json";
    a.click();
  };

  const toggleFoldNodes = () => {
    toggleFold(!foldNodes);
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
        <StyledElement href="/" as={StyledLogo}>
          <StyledText>J</StyledText>
          <StyledText secondary>C</StyledText>
        </StyledElement>

        <SidebarButton
          title="Edit JSON"
          deviceDisplay="mobile"
          onClick={() => toggleFullscreen(!fullscreen)}
          component={<AiOutlineEdit />}
        />

        <SidebarButton
          title="Import File"
          onClick={() => setVisible("import")(true)}
          component={<AiOutlineFileAdd />}
        />

        <SidebarButton
          title="Rotate Layout"
          onClick={toggleDirection}
          component={<StyledFlowIcon rotate={rotateLayout(direction)} />}
        />

        <SidebarButton
          title={foldNodes ? "Unfold Nodes" : "Fold Nodes"}
          deviceDisplay="desktop"
          onClick={toggleFoldNodes}
          component={foldNodes ? <CgArrowsShrinkH /> : <CgArrowsMergeAltH />}
        />

        <SidebarButton
          title={graphCollapsed ? "Expand Graph" : "Collapse Graph"}
          onClick={toggleExpandCollapseGraph}
          component={graphCollapsed ? <VscExpandAll /> : <VscCollapseAll />}
        />

        <SidebarButton
          title="Download JSON"
          deviceDisplay="desktop"
          onClick={handleSave}
          component={<AiOutlineSave />}
        />

        <SidebarButton
          title="Delete JSON"
          onClick={() => setVisible("clear")(true)}
          component={<AiOutlineDelete />}
        />

        <SidebarButton
          title="View Cloud"
          deviceDisplay="desktop"
          onClick={() => setVisible("cloud")(true)}
          component={<VscCloud />}
        />

        <SidebarButton
          title="Settings"
          deviceDisplay="mobile"
          onClick={() => setVisible("settings")(true)}
          component={<VscSettingsGear />}
        />
      </StyledTopWrapper>
      <StyledBottomWrapper>
        <SidebarButton
          title="Account"
          onClick={() => setVisible("account")(true)}
          component={<VscAccount />}
        />
        <SidebarButton
          title="Settings"
          onClick={() => setVisible("settings")(true)}
          component={<VscSettingsGear />}
        />
      </StyledBottomWrapper>
    </StyledSidebar>
  );
};
