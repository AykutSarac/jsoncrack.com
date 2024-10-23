import React from "react";
import type { ModalProps } from "@mantine/core";
import { Text, List, Button, Modal, Flex, Box, ThemeIcon, Image, Paper } from "@mantine/core";
import styled from "styled-components";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdChevronRight } from "react-icons/md";

const StyledPaper = styled(Paper)<any>`
  --bg-color: ${({ theme }) => theme.GRID_BG_COLOR};
  --line-color-1: ${({ theme }) => theme.GRID_COLOR_PRIMARY};
  --line-color-2: ${({ theme }) => theme.GRID_COLOR_SECONDARY};

  background-color: var(--bg-color);
  background-image: linear-gradient(var(--line-color-1) 1.5px, transparent 1.5px),
    linear-gradient(90deg, var(--line-color-1) 1.5px, transparent 1.5px),
    linear-gradient(var(--line-color-2) 1px, transparent 1px),
    linear-gradient(90deg, var(--line-color-2) 1px, transparent 1px);
  background-position:
    -1.5px -1.5px,
    -1.5px -1.5px,
    -1px -1px,
    -1px -1px;
  background-size:
    100px 100px,
    100px 100px,
    20px 20px,
    20px 20px;

  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.1);
  align-self: center;
`;

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  return (
    <Modal
      title={
        <Flex align="center" gap="8">
          <ThemeIcon variant="transparent">
            <Image src="https://todiagram.com/logo.svg" alt="ToDiagram" width={20} height={20} />
          </ThemeIcon>
          <Text fz="24" fw={600}>
            Get more with ToDiagram
          </Text>
        </Flex>
      }
      size="1000"
      opened={opened}
      onClose={onClose}
      zIndex={1001}
      centered
      radius="lg"
    >
      <Flex align="start">
        <Box px="lg" pb="lg">
          <Text fz="sm" mb="md">
            More productivity. More power. Our most-requested features are now available on a
            refined platform.
          </Text>
          <Text fz="md" fw={500} mb="sm">
            Here&apos;s what you get with ToDiagram:
          </Text>
          <List spacing="6" fz="md" icon={<IoMdCheckmarkCircleOutline size="24" color="#16a34a" />}>
            <List.Item>Load up to 4 MB data</List.Item>
            <List.Item>Edit data on diagrams</List.Item>
            <List.Item>Compare data</List.Item>
            <List.Item>AI-Powered filter</List.Item>
            <List.Item>Customizable theme</List.Item>
            <List.Item>Editor tabs</List.Item>
            <List.Item>5X Faster loading</List.Item>
            <List.Item>Store 200 Documents</List.Item>
          </List>
          <Text fz="md" my="sm">
            <Text component="span" inherit fw={500}>
              Cancel anytime.
            </Text>{" "}
            Pay monthly or annually.
          </Text>
          <Button
            component="a"
            href="https://todiagram.com?utm_source=app&utm_medium=upgrade_modal"
            target="_blank"
            rel="noopener"
            color="green"
            fullWidth
            mt="md"
            size="md"
            fw={500}
            radius="md"
            rightSection={<MdChevronRight size="24" />}
          >
            Get Started
          </Button>
        </Box>
        <StyledPaper ml="md" withBorder p="16">
          <Image
            miw="420"
            mih="420"
            mah="500"
            src="/assets/todiagram_img.webp"
            alt="ToDiagram"
            fit="contain"
          />
        </StyledPaper>
      </Flex>
    </Modal>
  );
};
