import React from "react";
import styled from "styled-components";
import { Anchor, Button, Group, Modal, Text } from "@mantine/core";
import { VscCode } from "react-icons/vsc";

const StyledAlert = styled.div`
  position: fixed;
  bottom: 36px;
  right: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-weight: 500;
  overflow: hidden;
`;

const StyledTitle = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.TEXT_POSITIVE};
  flex: 1;
  font-weight: 700;

  &::after {
    background: ${({ theme }) => theme.TEXT_POSITIVE};
    height: 1px;

    content: "";
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    margin-left: 4px;
    opacity: 0.6;
  }
`;

const isExternal = () => {
  if (window.location.pathname.includes("widget")) return false;
  if (window.location.host !== "jsoncrack.com") return true;
  return false;
};

export const ExternalMode = () => {
  const [isOpen, setOpen] = React.useState(false);
  if (!isExternal()) return null;

  const closeModal = () => setOpen(false);

  return (
    <StyledAlert>
      <Button
        onClick={() => setOpen(true)}
        color="red"
        variant="subtle"
        leftIcon={<VscCode size="1.2rem" />}
      >
        External Host
      </Button>
      <Modal title="External Host of JSON Crack" opened={isOpen} onClose={closeModal} centered>
        <Group>
          <StyledTitle>Hi! Did you like the editor?</StyledTitle>
          <Text>
            You are currently using the external release of the{" "}
            <Anchor href="https://jsoncrack.com">JSON Crack</Anchor>. Please consider supporting by
            one time or monthly sponsorship ✨
          </Text>
        </Group>
        <Group pt="lg" position="right">
          <Button
            onClick={closeModal}
            component="a"
            href="https://github.com/sponsors/AykutSarac"
            target="_blank"
            variant="light"
            color="red"
          >
            Donate
          </Button>
        </Group>
      </Modal>
    </StyledAlert>
  );
};
