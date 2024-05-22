import React from "react";
import type { ModalProps } from "@mantine/core";
import {
  Button,
  Radio,
  Modal,
  Text,
  Flex,
  Badge,
  Divider,
  Paper,
  useMantineTheme,
  useMantineColorScheme,
  List,
  Anchor,
  Image,
  ScrollArea,
} from "@mantine/core";
import styled from "styled-components";
import { ImgComparisonSlider } from "@img-comparison-slider/react";
import { IoMdArrowForward } from "react-icons/io";
import { MdCheck } from "react-icons/md";
import { gaEvent } from "src/lib/utils/gaEvent";
import { PRICING } from "src/pages/pricing";
import useUser from "src/store/useUser";

const StyledImgComparisonSlider = styled(ImgComparisonSlider)`
  --divider-width: 2px;
  --divider-color: #515151;
  --default-handle-opacity: 0.3;
  --default-handle-color: #000;
  border: 1px solid #999999;
  overflow: hidden;
  border-radius: 12px;
`;

const overlayLinks = {
  monthly:
    "https://herowand.lemonsqueezy.com/buy/ce30521f-c7cc-44f3-9435-995d3260ba22?embed=1&media=0&logo=0&desc=0&discount=0&enabled=67805",
  annual:
    "https://herowand.lemonsqueezy.com/buy/577928ea-fb09-4076-9307-3e5931b35ad0?embed=1&media=0&logo=0&desc=0&discount=0&enabled=82417",
};

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [plan, setPlan] = React.useState("monthly");
  const user = useUser(state => state.user);

  const handleSelect = () => {
    const link = new URL(overlayLinks[plan]);

    if (user?.email) {
      link.searchParams.append("checkout[email]", user.email);
    }

    if (user?.user_metadata.display_name) {
      link.searchParams.append("checkout[name]", user.user_metadata.display_name);
    }

    gaEvent("Premium Modal", "click select", plan);
    window.open(link.toString(), "_blank");
  };

  const getBorderColor = (value: string) => {
    if (plan === value) return theme.colors.blue[6];
    if (colorScheme === "dark") return theme.colors.gray[7];
    return theme.colors.gray[2];
  };

  return (
    <Modal
      title={
        <Text fz="xl" fw="bold" ml="auto">
          Unlock even more features!
        </Text>
      }
      centered
      size="lg"
      opened={opened}
      onClose={onClose}
      zIndex={202}
    >
      <Radio.Group
        color="indigo"
        value={plan}
        onChange={setPlan}
        label="Select your plan:"
        size="md"
      >
        <Flex gap="xs" mt="sm" align="center" justify="space-between">
          <Paper
            flex="1"
            withBorder
            radius="md"
            py="xs"
            px="sm"
            style={{
              borderColor: getBorderColor("monthly"),
              cursor: "pointer",
            }}
            onClick={() => setPlan("monthly")}
          >
            <Radio value="monthly" label="Monthly" size="xs" />
          </Paper>
          <Paper
            flex="1"
            withBorder
            radius="md"
            p="sm"
            style={{
              borderColor: getBorderColor("annual"),
              cursor: "pointer",
            }}
            onClick={() => setPlan("annual")}
          >
            <Flex justify="space-between">
              <Radio value="annual" label="Annual" size="xs" />
              <Badge variant="light" color="indigo" size="xs" radius="sm">
                Save 16%
              </Badge>
            </Flex>
          </Paper>
        </Flex>
      </Radio.Group>

      <ScrollArea.Autosize h={400} offsetScrollbars>
        <Text mt="md" fz="sm" fw="bold" mb="xs">
          What You Get
        </Text>
        <List
          fz="sm"
          lts={0.2}
          icon={<MdCheck color="#5199FF" size={20} style={{ verticalAlign: "middle" }} />}
        >
          <List.Item>500% Larger data size support (~4 MB)</List.Item>
          <List.Item>400% Better performance</List.Item>
          <List.Item>50% Less Nodes & Compact Graph Visualization</List.Item>
          <List.Item>Compare Data on Graphs</List.Item>
          <List.Item>Edit on Graphs</List.Item>
          <List.Item>
            <Anchor c="gray" fz="sm" href="/#preview" target="_blank">
              ...and more
            </Anchor>
          </List.Item>
        </List>

        <Paper mx="auto" maw="100%" mt="sm" w="fit-content">
          <StyledImgComparisonSlider hover allowTransparency>
            <Image
              slot="first"
              width={600}
              src="./assets/compare/graph_pro.webp"
              loading="lazy"
              alt="Premium Editor"
            />
            <Image
              slot="second"
              width={600}
              src="./assets/compare/graph_free.webp"
              loading="lazy"
              alt="Free Editor"
            />
          </StyledImgComparisonSlider>
        </Paper>
      </ScrollArea.Autosize>

      <Divider my="md" />
      <Flex align="center" justify="space-between">
        <Flex h={32} align="center">
          <Text c="gray" fz="xs" style={{ alignSelf: "baseline" }}>
            $
          </Text>
          <Text fz={28} fw="bold">
            {plan === "monthly" ? PRICING.MONTHLY : PRICING.ANNUAL}
          </Text>
          <Text ml="xs" fz="xs" c="dimmed">
            /mo (billed {plan === "monthly" ? "monthly" : "annually"})
          </Text>
        </Flex>
        <Button onClick={handleSelect} color="indigo" rightSection={<IoMdArrowForward />}>
          Upgrade
        </Button>
      </Flex>
    </Modal>
  );
};
