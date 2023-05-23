import React from "react";
import styled from "styled-components";
import { Badge, Flex, Group, MediaQuery, Menu, Text } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import toast from "react-hot-toast";
import { AiOutlineFullscreen, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { CgArrowsMergeAltH, CgArrowsShrinkH, CgChevronDown } from "react-icons/cg";
import { FiDownload } from "react-icons/fi";
import { MdCenterFocusWeak } from "react-icons/md";
import { SiJsonwebtokens } from "react-icons/si";
import { TiFlowMerge } from "react-icons/ti";
import {
  VscCollapseAll,
  VscExpandAll,
  VscJson,
  VscLayoutSidebarLeft,
  VscLayoutSidebarLeftOff,
  VscSettingsGear,
} from "react-icons/vsc";
import { SearchInput } from "src/components/SearchInput";
import useGraph from "src/store/useGraph";
import useJson from "src/store/useJson";
import useModal from "src/store/useModal";
import useStored from "src/store/useStored";
import useUser from "src/store/useUser";
import { getNextDirection } from "src/utils/graph/getNextDirection";
import { isIframe } from "src/utils/widget";

export const StyledTools = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: space-between;
  height: 36px;
  padding: 4px 8px;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  color: ${({ theme }) => theme.SILVER};
  box-shadow: 0 1px 0px ${({ theme }) => theme.BACKGROUND_TERTIARY};
  z-index: 36;

  @media only screen and (max-width: 320px) {
    display: none;
  }
`;

const StyledToolElement = styled.button<{ hide?: boolean }>`
  display: ${({ hide }) => (hide ? "none" : "grid")};
  place-content: center;
  font-size: 12px;
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

const StyledLogo = styled.img<{ invert: boolean }>`
  filter: ${({ invert }) => invert && "invert()"};
`;

const StyledFlowIcon = styled(TiFlowMerge)<{ rotate: number }>`
  transform: rotate(${({ rotate }) => `${rotate}deg`});
`;

function rotateLayout(direction: "LEFT" | "RIGHT" | "DOWN" | "UP") {
  if (direction === "LEFT") return 90;
  if (direction === "UP") return 180;
  if (direction === "RIGHT") return 270;
  return 360;
}

function fullscreenBrowser() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

export const Tools: React.FC<{ isWidget?: boolean }> = ({ isWidget = false }) => {
  const getJson = useJson(state => state.getJson);
  const setVisible = useModal(state => state.setVisible);
  const direction = useGraph(state => state.direction);
  const fullscreen = useGraph(state => state.fullscreen);
  const toggleFullscreen = useGraph(state => state.toggleFullscreen);
  const zoomIn = useGraph(state => state.zoomIn);
  const zoomOut = useGraph(state => state.zoomOut);
  const centerView = useGraph(state => state.centerView);
  const foldNodes = useGraph(state => state.foldNodes);
  const toggleFold = useGraph(state => state.toggleFold);
  const setDirection = useGraph(state => state.setDirection);
  const graphCollapsed = useGraph(state => state.graphCollapsed);
  const expandGraph = useGraph(state => state.expandGraph);
  const collapseGraph = useGraph(state => state.collapseGraph);
  const lightmode = useStored(state => state.lightmode);
  const premium = useUser(state => state.premium);

  const CoreKey = navigator.userAgent.indexOf("Mac OS X") ? "⌘" : "CTRL";

  const toggleEditor = () => toggleFullscreen(!fullscreen);

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

  const handleSave = () => {
    const a = document.createElement("a");
    const file = new Blob([getJson()], { type: "text/plain" });

    a.href = window.URL.createObjectURL(file);
    a.download = "jsoncrack.json";
    a.click();
  };

  useHotkeys([
    ["mod+shift+e", toggleEditor],
    ["mod+shift+d", toggleDirection],
    ["mod+shift+f", toggleFoldNodes],
    ["mod+shift+c", toggleExpandCollapseGraph],
    [
      "mod+f",
      () => {
        const input = document.querySelector("#search-node") as HTMLInputElement;
        input.focus();
      },
    ],
  ]);

  const logoURL = React.useMemo(() => {
    if (!isIframe()) return "https://jsoncrack.com";
    return window.location.href.replace("widget", "editor");
  }, []);

  return (
    <StyledTools>
      {isWidget && (
        <StyledToolElement
          as="a"
          title="JSON Crack"
          href={logoURL}
          target={isIframe() ? "_blank" : "_parent"}
        >
          <Flex gap="xs" align="center" justify="center">
            <StyledLogo
              src="/assets/icon.png"
              width="auto"
              height="16"
              alt="logo"
              invert={lightmode}
            />
          </Flex>
        </StyledToolElement>
      )}
      {!isWidget && (
        <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
          <Group spacing="xs" position="left" w="100%" noWrap>
            <StyledToolElement as="a" title="JSON Crack" href="https://jsoncrack.com">
              <Flex gap="xs" align="center" justify="center">
                <StyledLogo
                  src="/assets/icon.png"
                  width="auto"
                  height="16"
                  alt="logo"
                  invert={lightmode}
                />
                {premium && (
                  <Badge color="orange" radius="sm" fz="xs" fw="bold">
                    PREMIUM
                  </Badge>
                )}
              </Flex>
            </StyledToolElement>
            <StyledToolElement title="Import File" onClick={() => setVisible("import")(true)}>
              Import
            </StyledToolElement>
            <Menu shadow="md" closeOnItemClick={false}>
              <Menu.Target>
                <StyledToolElement>
                  <Flex align="center" gap={3}>
                    View <CgChevronDown />
                  </Flex>
                </StyledToolElement>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  fz={12}
                  onClick={toggleEditor}
                  icon={fullscreen ? <VscLayoutSidebarLeft /> : <VscLayoutSidebarLeftOff />}
                  rightSection={
                    <Text ml="md" fz={10} color="dimmed">
                      {CoreKey} Shift E
                    </Text>
                  }
                >
                  {fullscreen ? "Show" : "Hide"} Editor
                </Menu.Item>
                <Menu.Item
                  fz={12}
                  onClick={toggleDirection}
                  icon={<StyledFlowIcon rotate={rotateLayout(direction)} />}
                  rightSection={
                    <Text ml="md" fz={10} color="dimmed">
                      {CoreKey} Shift D
                    </Text>
                  }
                >
                  Rotate Layout
                </Menu.Item>
                <Menu.Item
                  fz={12}
                  onClick={toggleFoldNodes}
                  icon={foldNodes ? <CgArrowsShrinkH /> : <CgArrowsMergeAltH />}
                  rightSection={
                    <Text ml="md" fz={10} color="dimmed">
                      {CoreKey} Shift F
                    </Text>
                  }
                >
                  {foldNodes ? "Unfold" : "Fold"} Nodes
                </Menu.Item>
                <Menu.Item
                  fz={12}
                  onClick={toggleExpandCollapseGraph}
                  icon={graphCollapsed ? <VscExpandAll /> : <VscCollapseAll />}
                  rightSection={
                    <Text ml="md" fz={10} color="dimmed">
                      {CoreKey} Shift C
                    </Text>
                  }
                >
                  {graphCollapsed ? "Expand" : "Collapse"} Nodes
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Menu shadow="md">
              <Menu.Target>
                <StyledToolElement>
                  <Flex align="center" gap={3}>
                    Tools <CgChevronDown />
                  </Flex>
                </StyledToolElement>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item fz={12} icon={<VscJson />} onClick={() => setVisible("schema")(true)}>
                  JSON Schema
                </Menu.Item>
                <Menu.Item
                  fz={12}
                  icon={<SiJsonwebtokens />}
                  onClick={() => setVisible("jwt")(true)}
                >
                  Decode JWT
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <StyledToolElement title="Cloud" onClick={() => setVisible("cloud")(true)}>
              Cloud
            </StyledToolElement>
            <StyledToolElement title="Download as File" onClick={handleSave}>
              Download
            </StyledToolElement>
          </Group>
        </MediaQuery>
      )}
      <Group spacing="xs" position="right" w="100%" noWrap>
        <StyledToolElement title="Zoom Out" onClick={zoomOut}>
          <AiOutlineMinus size="18" />
        </StyledToolElement>
        <StyledToolElement title="Zoom In" onClick={zoomIn}>
          <AiOutlinePlus size="18" />
        </StyledToolElement>
        {!isWidget && (
          <StyledToolElement title="Save as Image" onClick={() => setVisible("download")(true)}>
            <FiDownload size="18" />
          </StyledToolElement>
        )}
        <StyledToolElement title="Center Canvas" onClick={centerView}>
          <MdCenterFocusWeak size="18" />
        </StyledToolElement>
        <SearchInput />
        <StyledToolElement title="Fullscreen" hide={isWidget} onClick={fullscreenBrowser}>
          <AiOutlineFullscreen size="18" />
        </StyledToolElement>
        <StyledToolElement
          title="Settings"
          hide={isWidget}
          onClick={() => setVisible("settings")(true)}
        >
          <VscSettingsGear size="18" />
        </StyledToolElement>
      </Group>
    </StyledTools>
  );
};
