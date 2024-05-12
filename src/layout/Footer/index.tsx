import React from "react";
import Link from "next/link";
import {
  Anchor,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import dayjs from "dayjs";
import { FaDiscord, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { JSONCrackLogo } from "../JsonCrackLogo";

export const Footer = () => {
  return (
    <Container mt={150}>
      <Stack align="center">
        <Title c="black" order={3}>Get Started with JSON Crack</Title>
        <Text fz="lg" c="dimmed">
          Designed for everyone, save time understanding your data.
        </Text>
        <Button color="dark" component={Link} prefetch={false} href="/pricing" radius="lg" size="xl">
          Get Started
        </Button>
      </Stack>
      <Divider my={60} />
      <Flex justify="space-between">
        <Stack gap={4} visibleFrom="sm">
          <JSONCrackLogo />
          <Anchor href="mailto:contact@jsoncrack.com" fz="xs" c="dimmed">
            contact@jsoncrack.com
          </Anchor>
        </Stack>
        <Flex gap={60} visibleFrom="sm">
          <Stack gap="xs">
            <Text fz="sm" c="dimmed">
              Product
            </Text>
            <Anchor
              fz="sm"
              c="dark"
              href="https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode"
            >
              VS Code
            </Anchor>
            <Anchor component={Link} prefetch={false} fz="sm" c="dark" href="/pricing">
              Pricing
            </Anchor>
          </Stack>
          <Stack gap="xs">
            <Text fz="sm" c="dimmed">
              Resources
            </Text>
            <Anchor
              fz="sm"
              c="dark"
              href="https://herowand.lemonsqueezy.com/affiliates"
              target="_blank"
            >
              Affiliate
            </Anchor>
            <Anchor component={Link} prefetch={false} fz="sm" c="dark" href="/#faq">
              FAQ
            </Anchor>
            <Anchor component={Link} prefetch={false} fz="sm" c="dark" href="/docs">
              Docs
            </Anchor>
          </Stack>
          <Stack gap="xs">
            <Text fz="sm" c="dimmed">
              Social
            </Text>
            <Flex gap="xs">
              <Anchor
                aria-label="LinkedIn"
                fz="sm"
                href="https://www.linkedin.com/company/herowand"
              >
                <ThemeIcon variant="transparent" color="dark">
                  <FaLinkedin size={20} />
                </ThemeIcon>
              </Anchor>
              <Anchor aria-label="X" fz="sm" href="https://twitter.com/jsoncrack">
                <ThemeIcon variant="transparent" color="dark">
                  <FaXTwitter size={20} />
                </ThemeIcon>
              </Anchor>
              <Anchor
                aria-label="GitHub"
                fz="sm"
                href="https://github.com/AykutSarac/jsoncrack.com"
              >
                <ThemeIcon variant="transparent" color="dark">
                  <FaGithub size={20} />
                </ThemeIcon>
              </Anchor>
              <Anchor aria-label="Discord" fz="sm" href="https://discord.com/invite/yVyTtCRueq">
                <ThemeIcon variant="transparent" color="dark">
                  <FaDiscord size={20} />
                </ThemeIcon>
              </Anchor>
            </Flex>
          </Stack>
        </Flex>
      </Flex>
      <Flex gap="xl">
        <Text fz="sm" c="dimmed">
          © {dayjs().get("year")} JSON Crack
        </Text>
        <Anchor component={Link} prefetch={false} fz="sm" c="dimmed" href="/legal/terms">
          <Text fz="sm" c="dimmed">
            Terms
          </Text>
        </Anchor>
        <Anchor component={Link} prefetch={false} fz="sm" c="dimmed" href="/legal/privacy">
          <Text fz="sm" c="dimmed">
            Privacy
          </Text>
        </Anchor>
      </Flex>
    </Container>
  );
};
