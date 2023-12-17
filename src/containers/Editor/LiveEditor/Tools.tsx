import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  Avatar,
  Flex,
  Group,
  Input,
  MediaQuery,
  Menu,
  SegmentedControl,
  Select,
  Text,
} from "@mantine/core";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import ReactGA from "react-ga4";
import toast from "react-hot-toast";
import { AiOutlineFullscreen } from "react-icons/ai";
import { BsCheck2 } from "react-icons/bs";
import { CgArrowsMergeAltH, CgArrowsShrinkH, CgChevronDown } from "react-icons/cg";
import { FiDownload } from "react-icons/fi";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { SiJsonwebtokens } from "react-icons/si";
import { TiFlowMerge } from "react-icons/ti";
import {
  VscCollapseAll,
  VscExpandAll,
  VscJson,
  VscTarget,
  VscSearchFuzzy,
  VscGroupByRefType,
  VscSignOut,
  VscFeedback,
  VscSignIn,
} from "react-icons/vsc";
import { SearchInput } from "src/components/SearchInput";
import { FileFormat } from "src/enums/file.enum";
import { ViewMode } from "src/enums/viewMode.enum";
import { JSONCrackLogo } from "src/layout/JsonCrackLogo";
import { getNextDirection } from "src/lib/utils/graph/getNextDirection";
import { isIframe } from "src/lib/utils/widget";
import useConfig from "src/store/useConfig";
import useFile from "src/store/useFile";
import useGraph from "src/store/useGraph";
import useJson from "src/store/useJson";
import useModal from "src/store/useModal";
import useUser from "src/store/useUser";

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
  const [coreKey, setCoreKey] = React.useState("CTRL");
  const toggleFold = useGraph(state => state.toggleFold);
  const setDirection = useGraph(state => state.setDirection);
  const direction = useGraph(state => state.direction);
  const expandGraph = useGraph(state => state.expandGraph);
  const collapseGraph = useGraph(state => state.collapseGraph);
  const focusFirstNode = useGraph(state => state.focusFirstNode);
  const foldNodes = useGraph(state => state.foldNodes);
  const graphCollapsed = useGraph(state => state.graphCollapsed);

  const toggleFoldNodes = () => {
    toggleFold(!foldNodes);
    toast(`${foldNodes ? "Unfolded" : "Folded"} nodes`);
  };

  const toggleDirection = () => {
    const nextDirection = getNextDirection(direction || "RIGHT");
    if (setDirection) setDirection(nextDirection);
  };

  const toggleExpandCollapseGraph = () => {
    if (graphCollapsed) expandGraph();
    else collapseGraph();

    toast(`${graphCollapsed ? "Expanded" : "Collapsed"} graph.`);
  };

  useHotkeys([
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
    <Menu shadow="md" closeOnItemClick={false} withArrow>
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
            toggleDirection();
            ReactGA.event({
              action: "toggle_layout_direction",
              category: "User",
              label: "Tools",
            });
          }}
          icon={<StyledFlowIcon rotate={rotateLayout(direction || "RIGHT")} />}
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
  const { push } = useRouter();

  const getJson = useJson(state => state.getJson);
  const setVisible = useModal(state => state.setVisible);
  const centerView = useGraph(state => state.centerView);
  const zoomIn = useGraph(state => state.zoomIn);
  const zoomOut = useGraph(state => state.zoomOut);
  const toggleGestures = useConfig(state => state.toggleGestures);
  const toggleChildrenCount = useConfig(state => state.toggleChildrenCount);
  const toggleDarkMode = useConfig(state => state.toggleDarkMode);
  const toggleRulers = useConfig(state => state.toggleRulers);
  const toggleCollapseButton = useConfig(state => state.toggleCollapseButton);
  const setViewMode = useConfig(state => state.setViewMode);
  const setZoomFactor = useGraph(state => state.setZoomFactor);
  const toggleImagePreview = useConfig(state => state.toggleImagePreview);
  const logout = useUser(state => state.logout);

  const user = useUser(state => state.user);
  const premium = useUser(state => state.premium);

  const zoomFactor = useGraph(state => state.viewPort?.zoomFactor || 1);
  const gesturesEnabled = useConfig(state => state.gesturesEnabled);
  const childrenCountVisible = useConfig(state => state.childrenCountVisible);
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);
  const viewMode = useConfig(state => state.viewMode);
  const rulersEnabled = useConfig(state => state.rulersEnabled);
  const collapseButtonVisible = useConfig(state => state.collapseButtonVisible);
  const imagePreviewEnabled = useConfig(state => state.imagePreviewEnabled);

  const setFormat = useFile(state => state.setFormat);
  const format = useFile(state => state.format);

  const [tempZoomValue, setTempZoomValue] = React.useState(zoomFactor);
  const [logoURL, setLogoURL] = React.useState("CTRL");

  React.useEffect(() => {
    if (!Number.isNaN(zoomFactor)) setTempZoomValue(zoomFactor);
  }, [zoomFactor]);

  useHotkeys([
    ["shift+Digit0", () => setZoomFactor(100 / 100)],
    ["shift+Digit1", centerView],
  ]);

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
            <Menu trigger="click" shadow="md" withArrow>
              <Menu.Target>
                <StyledToolElement title="View Mode">
                  <Flex align="center" gap={3}>
                    View Mode <CgChevronDown />
                  </Flex>
                </StyledToolElement>
              </Menu.Target>
              <Menu.Dropdown>
                <SegmentedControl
                  value={viewMode}
                  onChange={setViewMode}
                  data={[
                    { value: ViewMode.Graph, label: "Graph" },
                    { value: ViewMode.Tree, label: "Tree" },
                  ]}
                />
              </Menu.Dropdown>
            </Menu>
            <StyledToolElement title="Import File" onClick={() => setVisible("import")(true)}>
              Import
            </StyledToolElement>
            <ViewMenu />
            <Menu shadow="md" withArrow>
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
                <Menu.Item
                  fz={12}
                  icon={<VscGroupByRefType />}
                  onClick={() => setVisible("type")(true)}
                >
                  Generate Type
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
        <SearchInput />

        {!isWidget && (
          <StyledToolElement title="Save as Image" onClick={() => setVisible("download")(true)}>
            <FiDownload size="18" />
          </StyledToolElement>
        )}

        {!isWidget && (
          <Menu shadow="md" trigger="click" closeOnItemClick={false} withArrow>
            <Menu.Target>
              <StyledToolElement>
                <Flex gap={4}>
                  {Math.round(zoomFactor * 100)}%
                  <CgChevronDown />
                </Flex>
              </StyledToolElement>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>
                <Input
                  type="number"
                  value={Math.round(tempZoomValue * 100)}
                  onChange={e => setTempZoomValue(e.currentTarget.valueAsNumber / 100)}
                  onKeyDown={getHotkeyHandler([["Enter", () => setZoomFactor(tempZoomValue)]])}
                  size="xs"
                  rightSection="%"
                />
              </Menu.Item>
              <Menu.Item rightSection="+" onClick={zoomIn}>
                <Text size="xs">Zoom in</Text>
              </Menu.Item>
              <Menu.Item rightSection="-" onClick={zoomOut}>
                <Text size="xs">Zoom out</Text>
              </Menu.Item>
              <Menu.Item rightSection="⇧ 1" onClick={centerView}>
                <Text size="xs">Zoom to fit</Text>
              </Menu.Item>
              <Menu.Item onClick={() => setZoomFactor(50 / 100)}>
                <Text size="xs">Zoom to %50</Text>
              </Menu.Item>
              <Menu.Item rightSection="⇧ 0" onClick={() => setZoomFactor(100 / 100)}>
                <Text size="xs">Zoom to %100</Text>
              </Menu.Item>
              <Menu.Item onClick={() => setZoomFactor(200 / 100)}>
                <Text size="xs">Zoom to %200</Text>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                icon={<BsCheck2 opacity={rulersEnabled ? 100 : 0} />}
                onClick={() => toggleRulers(!rulersEnabled)}
              >
                <Text size="xs">Rulers</Text>
              </Menu.Item>
              <Menu.Item
                icon={<BsCheck2 opacity={gesturesEnabled ? 100 : 0} />}
                onClick={() => toggleGestures(!gesturesEnabled)}
              >
                <Text size="xs">Trackpad Gestures</Text>
              </Menu.Item>
              <Menu.Item
                icon={<BsCheck2 opacity={childrenCountVisible ? 100 : 0} />}
                onClick={() => toggleChildrenCount(!childrenCountVisible)}
              >
                <Text size="xs">Item Count</Text>
              </Menu.Item>
              <Menu.Item
                icon={<BsCheck2 opacity={imagePreviewEnabled ? 100 : 0} />}
                onClick={() => toggleImagePreview(!imagePreviewEnabled)}
              >
                <Text size="xs">Image Link Preview</Text>
              </Menu.Item>
              <Menu.Item
                icon={<BsCheck2 opacity={collapseButtonVisible ? 100 : 0} />}
                onClick={() => toggleCollapseButton(!collapseButtonVisible)}
              >
                <Text size="xs">Show Expand/Collapse</Text>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}

        {!isWidget && (
          <Menu shadow="md" trigger="click" closeOnItemClick={false} withArrow>
            <Menu.Target>
              <StyledToolElement>
                <Avatar
                  color="grape"
                  variant="filled"
                  size={20}
                  radius="xl"
                  src={user?.user_metadata.avatar_url}
                  alt={user?.user_metadata.name}
                >
                  {user?.user_metadata.name[0]}
                </Avatar>
              </StyledToolElement>
            </Menu.Target>
            <Menu.Dropdown>
              {user ? (
                <Menu.Item
                  icon={
                    <Avatar color="grape" alt={user.user_metadata.name} size={20} radius="xl">
                      {user?.user_metadata.name[0]}
                    </Avatar>
                  }
                  onClick={() => setVisible("account")(true)}
                  closeMenuOnClick
                >
                  <Text size="xs">Account</Text>
                </Menu.Item>
              ) : (
                <Link href="/sign-in">
                  <Menu.Item icon={<VscSignIn />}>
                    <Text size="xs">Sign in</Text>
                  </Menu.Item>
                </Link>
              )}
              {!premium && (
                <Menu.Item
                  icon={<MdOutlineWorkspacePremium color="red" />}
                  onClick={() => setVisible("premium")(true)}
                  closeMenuOnClick
                >
                  <Text
                    variant="gradient"
                    fw="bold"
                    gradient={{ from: "orange", to: "red" }}
                    size="xs"
                  >
                    Get Premium
                  </Text>
                </Menu.Item>
              )}
              <Menu.Item
                icon={<BsCheck2 opacity={darkmodeEnabled ? 100 : 0} />}
                onClick={() => toggleDarkMode(!darkmodeEnabled)}
              >
                <Text size="xs">Dark Mode</Text>
              </Menu.Item>
              {user && (
                <>
                  <Menu.Divider />
                  <Menu.Item
                    icon={<VscFeedback />}
                    onClick={() => setVisible("review")(true)}
                    closeMenuOnClick
                  >
                    <Text size="xs">Feedback</Text>
                  </Menu.Item>
                  <Menu.Item icon={<VscSignOut />} onClick={() => logout()} closeMenuOnClick>
                    <Text size="xs">Log out</Text>
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
        )}

        {!isWidget && (
          <StyledToolElement title="Fullscreen" $hide={isWidget} onClick={fullscreenBrowser}>
            <AiOutlineFullscreen size="18" />
          </StyledToolElement>
        )}
      </Group>
    </StyledTools>
  );
};
