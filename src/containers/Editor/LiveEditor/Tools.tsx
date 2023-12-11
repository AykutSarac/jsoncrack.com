import React from "react";
import styled from "styled-components";
import { Flex, Group, MediaQuery, Menu, Select, Text } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import ReactGA from "react-ga4";
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
  VscTarget,
  VscSearchFuzzy,
} from "react-icons/vsc";
import { SearchInput } from "src/components/SearchInput";
import useToggleHide from "src/hooks/useToggleHide";
import { JSONCrackLogo } from "src/layout/JsonCrackLogo";
import { getNextDirection } from "src/lib/utils/graph/getNextDirection";
import { isIframe } from "src/lib/utils/widget";
import useFile from "src/store/useFile";
import useGraph from "src/store/useGraph";
import useJson from "src/store/useJson";
import useModal from "src/store/useModal";
import { FileFormat } from "src/types/models";

export const StyledTools = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: space-between;
  height: 36px;
  padding: 4px 8px;
  background: ${({ theme }) => theme.TOOLBAR_BG};
  color: ${({ theme }) => theme.SILVER};
  box-shadow: 0 1px 0px ${({ theme }) => theme.BACKGROUND_TERTIARY};
  z-index: 36;

  @media only screen and (max-width: 320px) {
    display: none;
  }
`;

const StyledToolElement = styled.button<{ $hide?: boolean }>`
  display: ${({ $hide }) => ($hide ? "none" : "grid")};
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
    document.documentElement.requestFullscreen().catch(() => {
      toast.error("Unable to enter fullscreen mode.");
    });
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

const ViewMenu = () => {
  const { validateHiddenNodes } = useToggleHide();
  const [coreKey, setCoreKey] = React.useState("CTRL");
  const toggleFold = useGraph(state => state.toggleFold);
  const setDirection = useGraph(state => state.setDirection);
  const expandGraph = useGraph(state => state.expandGraph);
  const collapseGraph = useGraph(state => state.collapseGraph);
  const toggleFullscreen = useGraph(state => state.toggleFullscreen);
  const focusFirstNode = useGraph(state => state.focusFirstNode);
  const foldNodes = useGraph(state => state.foldNodes);
  const graphCollapsed = useGraph(state => state.graphCollapsed);
  const direction = useGraph(state => state.direction);
  const fullscreen = useGraph(state => state.fullscreen);

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
    validateHiddenNodes();
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

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCoreKey(navigator.userAgent.indexOf("Mac OS X") ? "⌘" : "CTRL");
    }
  }, []);

  return (
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
          onClick={() => {
            toggleEditor();
            ReactGA.event({
              action: "toggle_hide_editor",
              category: "User",
              label: "Tools",
            });
          }}
          icon={fullscreen ? <VscLayoutSidebarLeft /> : <VscLayoutSidebarLeftOff />}
          rightSection={
            <Text ml="md" fz={10} color="dimmed">
              {coreKey} Shift E
            </Text>
          }
        >
          {fullscreen ? "Show" : "Hide"} Editor
        </Menu.Item>
        <Menu.Item
          fz={12}
          onClick={() => {
            toggleDirection();
            ReactGA.event({
              action: "toggle_layout_direction",
              category: "User",
              label: "Tools",
            });
          }}
          icon={<StyledFlowIcon rotate={rotateLayout(direction)} />}
          rightSection={
            <Text ml="md" fz={10} color="dimmed">
              {coreKey} Shift D
            </Text>
          }
        >
          Rotate Layout
        </Menu.Item>
        <Menu.Item
          fz={12}
          onClick={() => {
            toggleFoldNodes();
            ReactGA.event({
              action: "toggle_fold_nodes",
              category: "User",
              label: "Tools",
            });
          }}
          icon={foldNodes ? <CgArrowsShrinkH /> : <CgArrowsMergeAltH />}
          rightSection={
            <Text ml="md" fz={10} color="dimmed">
              {coreKey} Shift F
            </Text>
          }
        >
          {foldNodes ? "Unfold" : "Fold"} Nodes
        </Menu.Item>
        <Menu.Item
          fz={12}
          onClick={() => {
            toggleExpandCollapseGraph();
            ReactGA.event({
              action: "toggle_collapse_nodes",
              category: "User",
              label: "Tools",
            });
          }}
          icon={graphCollapsed ? <VscExpandAll /> : <VscCollapseAll />}
          rightSection={
            <Text ml="md" fz={10} color="dimmed">
              {coreKey} Shift C
            </Text>
          }
        >
          {graphCollapsed ? "Expand" : "Collapse"} Nodes
        </Menu.Item>
        <Menu.Item fz={12} onClick={focusFirstNode} icon={<VscTarget />}>
          Focus to First Node
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export const Tools: React.FC<{ isWidget?: boolean }> = ({ isWidget = false }) => {
  const getJson = useJson(state => state.getJson);
  const setVisible = useModal(state => state.setVisible);
  const zoomIn = useGraph(state => state.zoomIn);
  const zoomOut = useGraph(state => state.zoomOut);
  const centerView = useGraph(state => state.centerView);

  const setFormat = useFile(state => state.setFormat);
  const format = useFile(state => state.format);
  const [logoURL, setLogoURL] = React.useState("CTRL");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const url = !isIframe()
        ? "https://jsoncrack.com"
        : window.location.href.replace("widget", "editor");

      setLogoURL(url);
    }
  }, []);

  const handleSave = () => {
    const a = document.createElement("a");
    const file = new Blob([getJson()], { type: "text/plain" });

    a.href = window.URL.createObjectURL(file);
    a.download = "jsoncrack.json";
    a.click();
  };

  return (
    <StyledTools>
      {isWidget && (
        <StyledToolElement title="JSON Crack">
          <Flex gap="xs" align="center" justify="center">
            <JSONCrackLogo
              fontSize="1.2em"
              href={logoURL}
              target={isIframe() ? "_blank" : "_parent"}
            />
          </Flex>
        </StyledToolElement>
      )}
      {!isWidget && (
        <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
          <Group spacing="xs" position="left" w="100%" noWrap>
            <StyledToolElement title="JSON Crack">
              <Flex gap="xs" align="center" justify="center">
                <JSONCrackLogo fontSize="1.2em" />
              </Flex>
            </StyledToolElement>
            <Select
              defaultValue="json"
              size="xs"
              value={format}
              onChange={setFormat}
              miw={80}
              w={120}
              data={[
                { value: FileFormat.JSON, label: "JSON" },
                { value: FileFormat.YAML, label: "YAML" },
                { value: FileFormat.XML, label: "XML" },
                { value: FileFormat.TOML, label: "TOML" },
                { value: FileFormat.CSV, label: "CSV" },
              ]}
            />
            <StyledToolElement title="Import File" onClick={() => setVisible("import")(true)}>
              Import
            </StyledToolElement>
            <ViewMenu />
            <Menu shadow="md">
              <Menu.Target>
                <StyledToolElement>
                  <Flex align="center" gap={3}>
                    Tools <CgChevronDown />
                  </Flex>
                </StyledToolElement>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item fz={12} icon={<VscSearchFuzzy />} onClick={() => setVisible("jq")(true)}>
                  JSON Query (jq)
                </Menu.Item>
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
        <StyledToolElement title="Fullscreen" $hide={isWidget} onClick={fullscreenBrowser}>
          <AiOutlineFullscreen size="18" />
        </StyledToolElement>
        <StyledToolElement
          title="Settings"
          $hide={isWidget}
          onClick={() => setVisible("settings")(true)}
        >
          <VscSettingsGear size="18" />
        </StyledToolElement>
      </Group>
    </StyledTools>
  );
};
