import React from "react";
import { Text, Flex, Group, Select } from "@mantine/core";
import styled from "styled-components";
import toast from "react-hot-toast";
import { AiOutlineFullscreen } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import { LuCrown } from "react-icons/lu";
import { SearchInput } from "src/containers/Toolbar/SearchInput";
import { FileFormat } from "src/enums/file.enum";
import { JSONCrackLogo } from "src/layout/JsonCrackLogo";
import useFile from "src/store/useFile";
import useModal from "src/store/useModal";
import { AccountMenu } from "./AccountMenu";
import { FileMenu } from "./FileMenu";
import { Logo } from "./Logo";
import { OptionsMenu } from "./OptionsMenu";
import { ToolsMenu } from "./ToolsMenu";
import { ViewMenu } from "./ViewMenu";
import { ZoomMenu } from "./ZoomMenu";
import { StyledToolElement } from "./styles";

const StyledTools = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 4px;
  justify-content: space-between;
  height: 40px;
  padding: 4px 8px;
  background: ${({ theme }) => theme.TOOLBAR_BG};
  color: ${({ theme }) => theme.SILVER};
  z-index: 36;
  border-bottom: 1px solid ${({ theme }) => theme.SILVER_DARK};

  @media only screen and (max-width: 320px) {
    display: none;
  }
`;

function fullscreenBrowser() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {
      toast.error("Unable to enter fullscreen mode.");
    });
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

interface ToolbarProps {
  isWidget?: boolean;
}

export const Toolbar = ({ isWidget = false }: ToolbarProps) => {
  const setVisible = useModal(state => state.setVisible);
  const setFormat = useFile(state => state.setFormat);
  const format = useFile(state => state.format);

  return (
    <StyledTools>
      {isWidget && <Logo />}
      {!isWidget && (
        <Group gap="xs" justify="left" w="100%" style={{ flexWrap: "nowrap" }}>
          <StyledToolElement title="JSON Crack">
            <Flex gap="xs" align="center" justify="center">
              <JSONCrackLogo fontSize="0.8rem" hideLogo />
            </Flex>
          </StyledToolElement>

          <Select
            defaultValue="json"
            size="xs"
            value={format}
            onChange={e => setFormat(e as FileFormat)}
            miw={80}
            w={120}
            data={[
              { value: FileFormat.JSON, label: "JSON" },
              { value: FileFormat.YAML, label: "YAML" },
              { value: FileFormat.XML, label: "XML" },
              { value: FileFormat.TOML, label: "TOML" },
              { value: FileFormat.CSV, label: "CSV" },
            ]}
            allowDeselect={false}
          />

          <FileMenu />
          <ViewMenu />
          <ToolsMenu />
        </Group>
      )}
      <Group gap="xs" justify="right" w="100%" style={{ flexWrap: "nowrap" }}>
        {!isWidget && (
          <StyledToolElement onClick={() => setVisible("upgrade")(true)} $highlight>
            <Flex align="center" gap="6">
              <LuCrown size="16" />
              <Text c="bright" fw={600} fz="xs">
                Unlock advanced features
              </Text>
            </Flex>
          </StyledToolElement>
        )}

        <SearchInput />
        {!isWidget && (
          <>
            <StyledToolElement title="Save as Image" onClick={() => setVisible("download")(true)}>
              <FiDownload size="18" />
            </StyledToolElement>
            <ZoomMenu />
            <AccountMenu />
            <OptionsMenu />
            <StyledToolElement title="Fullscreen" $hide={isWidget} onClick={fullscreenBrowser}>
              <AiOutlineFullscreen size="18" />
            </StyledToolElement>
          </>
        )}
      </Group>
    </StyledTools>
  );
};
