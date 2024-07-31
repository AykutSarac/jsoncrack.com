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
import { MdOutlineTimer } from "react-icons/md";
import { gaEvent } from "src/lib/utils/gaEvent";
import { PRICING, purchaseLinks } from "src/pages/pricing";
import useUser from "src/store/useUser";

const StyledRadioCard = styled(Radio.Card)`
  border-width: 2px;
  border-color: #efefef;
  min-width: 450px;
  transition: 0.2s;

  &[data-checked] {
    border-color: #2d2d2d;
  }

  &[data-checked]:hover {
    background: #f3f3f3;
  }

  &:hover {
    border-color: #7f7f7f;
  }
`;

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  const user = useUser(state => state.user);
  const [plan, setPlan] = React.useState("ltd");

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
        body: { background: "white" },
        header: { background: "white" },
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
              <StyledRadioCard value="montfhly" radius="lg" px="xl" py="md">
                <Group align="center" justify="space-between">
                  <Flex align="center" gap="xs">
                    <Text fz="xl" c="gray.7" fw={600}>
                      Monthly
                    </Text>
                  </Flex>
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
                    <Badge
                      variant="light"
                      size="sm"
                      radius="lg"
                      color="red"
                      leftSection={<MdOutlineTimer size="12" />}
                    >
                      Limited
                    </Badge>
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
