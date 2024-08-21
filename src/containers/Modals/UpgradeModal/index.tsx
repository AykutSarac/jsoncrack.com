import React from "react";
import type { ModalProps } from "@mantine/core";
import {
  Text,
  Flex,
  Divider,
  List,
  Drawer,
  Stack,
  Radio,
  Badge,
  Button,
  Group,
  Anchor,
} from "@mantine/core";
import styled from "styled-components";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdChevronRight, MdOutlineTimer } from "react-icons/md";
import { gaEvent } from "src/lib/utils/gaEvent";
import { PRICING, purchaseLinks } from "src/pages/pricing";
import useUser from "src/store/useUser";

const StyledRadioCard = styled(Radio.Card)`
  border-width: 2px;
  border-color: #efefef;
  min-width: 450px;
  transition: 0.2s;

  &[data-checked] {
    border-color: #2cb200;
    background: #f9fff7;
  }

  &:hover:not([data-checked]) {
    border-color: #d5d5d5;
    background: #fafafa;
  }
`;

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  const user = useUser(state => state.user);
  const [plan, setPlan] = React.useState("annual");

  const handleUpgrade = () => {
    const link = new URL(purchaseLinks[plan]);

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
    <Drawer
      size="md"
      opened={opened}
      onClose={onClose}
      zIndex={202}
      position="bottom"
      radius="lg"
      styles={{
        body: { background: "#ffffff" },
        header: { background: "#ffffff" },
        content: { background: "#ffffff" },
      }}
    >
      <Flex mx="auto" w="fit-content" miw={600} gap="3vw" justify="space-between">
        <Stack>
          <Text c="black" fz="h2" fw={600}>
            Upgrade
          </Text>
          <Divider fz="md" labelPosition="left" label="Included features" color="gray.4" />
          <List
            spacing="xs"
            c="gray.7"
            icon={<IoMdCheckmarkCircleOutline size="24" color="#16a34a" />}
          >
            <List.Item>Larger data support up to 4 MB</List.Item>
            <List.Item>Edit data directly on visualizations</List.Item>
            <List.Item>Compare data differences on graphs</List.Item>
            <List.Item>AI-powered data filter</List.Item>
            <List.Item>Customizable graph colors</List.Item>
            <List.Item>Tabs for multiple documents</List.Item>
            <List.Item>
              <Anchor c="inherit" td="underline" href="/premium#preview" target="_blank">
                ..see all features
              </Anchor>
            </List.Item>
          </List>
        </Stack>
        <Radio.Group value={plan} onChange={setPlan}>
          <Stack>
            <StyledRadioCard value="monthly" radius="lg" px="xl" py="md">
              <Group align="center" justify="space-between">
                <Flex align="center" gap="xs">
                  <Text fz="xl" c="gray.7" fw={600}>
                    Monthly
                  </Text>
                </Flex>
                <Flex fw={500} align="baseline" fz="sm" c="gray.5">
                  <Text fw={600} fz="xl" c="gray.7" mr="2">
                    ${PRICING.MONTHLY}
                  </Text>
                  <Text inherit mr="2">
                    /
                  </Text>
                  month
                </Flex>
              </Group>
            </StyledRadioCard>
            <StyledRadioCard value="annual" radius="lg" px="xl" py="md">
              <Group align="center" justify="space-between">
                <Flex align="center" gap="xs">
                  <Text fz="xl" c="gray.7" fw={600}>
                    Yearly
                  </Text>
                </Flex>
                <Flex fw={500} align="baseline" fz="sm" c="gray.5">
                  <Text fw={600} fz="xl" c="gray.7" mr="2">
                    ${PRICING.ANNUAL * 12}
                  </Text>
                  <Text inherit mr="2">
                    /
                  </Text>
                  year
                </Flex>
              </Group>
            </StyledRadioCard>
            {PRICING.LTD && (
              <StyledRadioCard value="ltd" radius="lg" px="xl" py="md">
                <Group align="center" justify="space-between">
                  <Flex align="center" gap="xs">
                    <Text fz="xl" c="gray.7" fw={600}>
                      Lifetime
                    </Text>
                    <Badge
                      variant="light"
                      size="md"
                      radius="lg"
                      color="#f00"
                      leftSection={<MdOutlineTimer size="12" />}
                    >
                      Limited
                    </Badge>
                  </Flex>
                  <Flex fw={500} align="baseline" fz="sm" c="gray.5">
                    <Text fw={600} fz="xl" c="gray.7" mr="2">
                      ${PRICING.LTD}
                    </Text>
                    <Text inherit mr="2">
                      /
                    </Text>
                    lifetime
                  </Flex>
                </Group>
              </StyledRadioCard>
            )}
          </Stack>
          <Button
            color="green"
            fullWidth
            mt="xl"
            size="xl"
            radius="md"
            onClick={handleUpgrade}
            rightSection={<MdChevronRight size="24" />}
          >
            Upgrade
          </Button>
        </Radio.Group>
      </Flex>
    </Drawer>
  );
};
