import React from "react";
import type { ModalProps } from "@mantine/core";
import {
  Button,
  Image,
  Radio,
  Modal,
  Text,
  Stack,
  Tooltip,
  Flex,
  Badge,
  Divider,
  CheckIcon,
} from "@mantine/core";
import { gaEvent } from "src/lib/utils/gaEvent";
import { PRICING } from "src/pages/pricing";
import useUser from "src/store/useUser";

const overlayLinks = {
  monthly:
    "https://herowand.lemonsqueezy.com/buy/ce30521f-c7cc-44f3-9435-995d3260ba22?embed=1&media=0&logo=0&desc=0&discount=0&enabled=67805",
  annual:
    "https://herowand.lemonsqueezy.com/buy/577928ea-fb09-4076-9307-3e5931b35ad0?embed=1&media=0&logo=0&desc=0&discount=0&enabled=82417",
};

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  const [plan, setPlan] = React.useState<string>("annual");
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

  return (
    <Modal size="md" opened={opened} onClose={onClose} centered zIndex={202}>
      <Flex justify="center" gap="xl" mx="auto">
        <Image src="./assets/pacman.png" radius="md" w={50} alt="green tetris block" />
        <Image src="./assets/tetris.png" radius="md" w={50} alt="yellow tetris block" />
      </Flex>
      <Text fw="bold" fz="xl" ta="center" my="lg">
        Unlock even more features!
      </Text>
      <Text fz="sm">
        We&apos;ve developed a new editor for individuals & professionals who deal with data on a
        regular basis.
      </Text>
      <Text mt="xs" fz="sm">
        Upgrade your plan and take advantage of improved speed, enhanced readability, and a more
        compact design.
      </Text>

      <Radio.Group value={plan} onChange={setPlan} mt="md" label="Choose one:">
        <Stack mt="xs" gap="xs">
          <Flex align="center" justify="space-between">
            <Radio
              icon={CheckIcon}
              value="annual"
              label={
                <Flex align="center" w="100%" justify="space-between">
                  <Text>1 Year</Text>
                  <Badge ml="xs" size="xs" color="green">
                    Save 16%
                  </Badge>
                </Flex>
              }
            />
            <Text c="dimmed" fz="sm">
              ${PRICING.ANNUAL * 12}
            </Text>
          </Flex>
          <Flex align="center" justify="space-between">
            <Radio icon={CheckIcon} value="monthly" label={<Text>1 Month</Text>} />
            <Text c="dimmed" fz="sm">
              ${PRICING.MONTHLY}
            </Text>
          </Flex>
        </Stack>
      </Radio.Group>

      <Divider my="xs" />
      <Flex justify="space-between">
        <Button color="gray" variant="subtle" onClick={onClose}>
          Back
        </Button>
        <Tooltip
          label="You will be taken to the checkout screen"
          position="bottom"
          fz="xs"
          withArrow
        >
          <Button onClick={handleSelect} color="blue" px="xl">
            Select
          </Button>
        </Tooltip>
      </Flex>
    </Modal>
  );
};
