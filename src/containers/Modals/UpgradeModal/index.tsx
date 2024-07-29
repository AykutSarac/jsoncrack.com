import React from "react";
import type { ModalProps } from "@mantine/core";
import {
  Text,
  Flex,
  Divider,
  Paper,
  List,
  Drawer,
  Stack,
  Radio,
  Badge,
  Button,
  Group,
} from "@mantine/core";
import styled from "styled-components";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { gaEvent } from "src/lib/utils/gaEvent";
import { PRICING, purchaseLinks } from "src/pages/pricing";
import useUser from "src/store/useUser";

const StyledRadioCard = styled(Radio.Card)`
  border-width: 2px;
  border-color: #efefef;
  min-width: 400px;
  transition: 0.2s;

  &[data-checked] {
    border-color: black;
  }

  &[data-checked]:hover {
    background: #f6f6f6;
  }

  &:hover {
    border-color: #555555;
  }
`;

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  const user = useUser(state => state.user);
  const [plan, setPlan] = React.useState("monthly");

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
        body: {
          background: "white",
        },
        header: {
          background: "white",
        },
      }}
    >
      <Paper
        bg="white"
        miw={600}
        p={30}
        radius="lg"
        mx="auto"
        w="fit-content"
        style={{
          border: "2px solid #e2e2e2",
        }}
      >
        <Flex gap="3vw" justify="space-between">
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
              <List.Item>Compare data differences on graph</List.Item>
              <List.Item>AI-powered data filter</List.Item>
              <List.Item>Customizable graph colors</List.Item>
              <List.Item>Edit data directly on graph</List.Item>
              <List.Item>Tabs for multiple documents</List.Item>
            </List>
          </Stack>
          <Radio.Group value={plan} onChange={setPlan}>
            <Stack>
              <StyledRadioCard value="monthly" radius="lg" px="xl" py="md">
                <Group align="center" justify="space-between">
                  <Text c="gray.7" fz="xl" fw={600}>
                    Monthly
                  </Text>
                  <Flex fw={500} align="baseline" fz="sm" c="gray.5">
                    <Text fw={600} fz="xl" c="gray.7">
                      ${PRICING.MONTHLY}
                    </Text>
                    /month
                  </Flex>
                </Group>
              </StyledRadioCard>
              <StyledRadioCard value="annual" radius="lg" px="xl" py="md">
                <Group align="center" justify="space-between">
                  <Flex align="center" gap="xs">
                    <Text fz="xl" c="gray.7" fw={600}>
                      Yearly
                    </Text>
                    <Badge size="md" radius="lg" color="yellow.4">
                      Save {PRICING.getAnnualSave()}%
                    </Badge>
                  </Flex>
                  <Flex fw={500} align="baseline" fz="sm" c="gray.5">
                    <Text fw={600} fz="xl" c="gray.7">
                      ${PRICING.ANNUAL * 12}
                    </Text>
                    /year
                  </Flex>
                </Group>
              </StyledRadioCard>
              <StyledRadioCard value="ltd" radius="lg" px="xl" py="md">
                <Group align="center" justify="space-between">
                  <Flex align="center" gap="xs">
                    <Text fz="xl" c="gray.7" fw={600}>
                      Lifetime
                    </Text>
                  </Flex>
                  <Flex fw={500} align="baseline" fz="sm" c="gray.5">
                    <Text fw={600} fz="xl" c="gray.7">
                      ${PRICING.LTD}
                    </Text>
                    /lifetime
                  </Flex>
                </Group>
              </StyledRadioCard>
            </Stack>
            <Button color="dark" fullWidth mt="xl" size="xl" radius="md" onClick={handleUpgrade}>
              Upgrade
            </Button>
          </Radio.Group>
        </Flex>
      </Paper>
    </Drawer>
  );
};
