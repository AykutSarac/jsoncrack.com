import React from "react";
import Link from "next/link";
import type { ModalProps } from "@mantine/core";
import {
  Text,
  Divider,
  List,
  Button,
  Modal,
  Flex,
  Box,
  AspectRatio,
  ThemeIcon,
  Image,
} from "@mantine/core";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdChevronRight } from "react-icons/md";

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  return (
    <Modal
      title={
        <Flex align="center" gap="8">
          <ThemeIcon variant="transparent">
            <Image src="https://todiagram.com/logo.svg" alt="ToDiagram" width={24} height={24} />
          </ThemeIcon>
          <Text fz="h2" fw={600}>
            Get more with ToDiagram
          </Text>
        </Flex>
      }
      size="1000"
      opened={opened}
      onClose={onClose}
      zIndex={1001}
      centered
    >
      <Flex align="center">
        <Box flex="0.6">
          <Text fz="sm" mb="sm">
            More productivity. More power. Our most-requested features are now available on a
            refined platform.
          </Text>
          <Text fz="sm" fw={500} mb="sm">
            Here&apos;s what you get with ToDiagram:
          </Text>
          <List spacing="6" fz="sm" icon={<IoMdCheckmarkCircleOutline size="24" color="#16a34a" />}>
            <List.Item>
              Larger data support up to{" "}
              <Text component="span" inherit fw={600}>
                4 MB
              </Text>
            </List.Item>
            <List.Item>Edit data directly on visualizations</List.Item>
            <List.Item>Compare data differences on graphs</List.Item>
            <List.Item>AI-powered data filter</List.Item>
            <List.Item>Customizable graph colors</List.Item>
            <List.Item>Tabs for multiple documents</List.Item>
            <List.Item>...faster, and more</List.Item>
          </List>
          <Link href="https://todiagram.com" target="_blank" passHref>
            <Button
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
          </Link>
        </Box>
        <Divider orientation="vertical" mx="md" />
        <Box flex="1">
          <AspectRatio ratio={16 / 9}>
            <video
              autoPlay
              height="auto"
              muted
              loop
              playsInline
              style={{ display: "block", borderRadius: "8px", border: "2px solid #e9e9e9" }}
            >
              <source src="https://todiagram.com/videos/diagrams.mp4" type="video/mp4" />
            </video>
          </AspectRatio>
        </Box>
      </Flex>
    </Modal>
  );
};
