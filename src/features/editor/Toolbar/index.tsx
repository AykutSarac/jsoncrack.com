import React from "react";
import Link from "next/link";
import { Flex, Group, Button } from "@mantine/core";
import styled from "styled-components";
import toast from "react-hot-toast";
import { AiOutlineFullscreen } from "react-icons/ai";
import { FaCrown, FaGithub } from "react-icons/fa6";
import { LuLink } from "react-icons/lu";
import { JSONCrackLogo } from "../../../layout/JsonCrackLogo";
import { useModal } from "../../../store/useModal";
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
  const setVisible = useModal(state => state.setVisible);

  return (
    <StyledTools>
      <Group gap="xs" justify="left" w="100%" style={{ flexWrap: "nowrap" }}>
        <StyledToolElement title="JSON Crack">
          <Flex gap="xs" align="center" justify="center">
            <JSONCrackLogo fontSize="0.8rem" hideLogo />
          </Flex>
        </StyledToolElement>
        <FileMenu />
        <ViewMenu />
        <ToolsMenu />
        <Button
          component={Link}
          href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=toolbar"
          target="_blank"
          rel="noopener"
          autoContrast
          color="yellow"
          variant="light"
          size="compact-xs"
          fz="12"
          fw="600"
          leftSection={<FaCrown />}
        >
          Try Pro
        </Button>
      </Group>
      <Group gap="xs" justify="right" w="100%" style={{ flexWrap: "nowrap" }}>
        <Button
          color="gray"
          fz="12"
          leftSection={<LuLink />}
          size="compact-sm"
          variant="default"
          onClick={() => setVisible("UpgradeModal", true)}
        >
          Share
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
