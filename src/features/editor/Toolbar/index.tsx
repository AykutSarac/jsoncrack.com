import React from "react";
import Link from "next/link";
import { Flex, Group, Select, Button } from "@mantine/core";
import styled from "styled-components";
import toast from "react-hot-toast";
import { AiOutlineFullscreen } from "react-icons/ai";
import { FaFireFlameCurved, FaGithub } from "react-icons/fa6";
import { type FileFormat, formats } from "../../../enums/file.enum";
import { JSONCrackLogo } from "../../../layout/JsonCrackLogo";
import useFile from "../../../store/useFile";
import { FileMenu } from "./FileMenu";
import { ToolsMenu } from "./ToolsMenu";
import { ViewMenu } from "./ViewMenu";
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

export const Toolbar = () => {
  const setFormat = useFile(state => state.setFormat);
  const format = useFile(state => state.format);

  return (
    <StyledTools>
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
          data={formats}
          allowDeselect={false}
        />

        <FileMenu />
        <ViewMenu />
        <ToolsMenu />
      </Group>
      <Group gap="xs" justify="right" w="100%" style={{ flexWrap: "nowrap" }}>
        <Button
          component={Link}
          href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=toolbar"
          target="_blank"
          rel="noopener"
          autoContrast
          color="green"
          variant="outline"
          c="bright"
          size="compact-sm"
          fz="12"
          fw="600"
          leftSection={<FaFireFlameCurved />}
        >
          JSON Crack v2.0 | ToDiagram
        </Button>
        <Link href="https://github.com/AykutSarac/jsoncrack.com" rel="noopener" target="_blank">
          <StyledToolElement title="GitHub">
            <FaGithub size="18" />
          </StyledToolElement>
        </Link>
        <StyledToolElement title="Fullscreen" onClick={fullscreenBrowser}>
          <AiOutlineFullscreen size="18" />
        </StyledToolElement>
      </Group>
    </StyledTools>
  );
};
