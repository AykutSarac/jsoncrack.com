import React from "react";
import Link from "next/link";
import { Anchor, Container, Divider, Flex, Stack, Text, ThemeIcon } from "@mantine/core";
import dayjs from "dayjs";
import { FaDiscord, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { JSONCrackLogo } from "./JsonCrackLogo";

export const Footer = () => {
  return (
    <Container mt={150} px={60} pb="xl" bg="black" fluid>
      <Divider color="gray.3" mb="xl" mx={-60} />
      <Flex justify="space-between">
        <Stack gap={4} visibleFrom="sm">
          <JSONCrackLogo />
          <Anchor href="mailto:contact@jsoncrack.com" fz="xs" c="dimmed">
            contact@jsoncrack.com
          </Anchor>
        </Stack>
        <Flex gap={60} visibleFrom="sm">
          <Stack gap="xs">
            <Text fz="sm" c="white">
              Product
            </Text>
            <Anchor
              fz="sm"
              c="gray.5"
              href="https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode"
            >
              VS Code
            </Anchor>
            <Anchor
              href="https://github.com/AykutSarac/jsoncrack.com"
              fz="sm"
              c="gray.5"
              target="_blank"
            >
              Open Source
            </Anchor>
          </Stack>
          <Stack gap="xs">
            <Text fz="sm" c="white">
              Resources
            </Text>
            <Anchor component={Link} prefetch={false} fz="sm" c="gray.5" href="/#faq">
              FAQ
            </Anchor>
            <Anchor component={Link} prefetch={false} fz="sm" c="gray.5" href="/docs">
              Docs
            </Anchor>
          </Stack>
          <Stack gap="xs">
            <Text fz="sm" c="white">
              Social
            </Text>
            <Flex gap="xs">
              <Anchor
                aria-label="LinkedIn"
                href="https://www.linkedin.com/company/jsoncrack"
                fz="sm"
              >
                <ThemeIcon variant="transparent" color="gray.5">
                  <FaLinkedin size={20} />
                </ThemeIcon>
              </Anchor>
              <Anchor aria-label="X" fz="sm" href="https://x.com/jsoncrack">
                <ThemeIcon variant="transparent" color="gray.5">
                  <FaXTwitter size={20} />
                </ThemeIcon>
              </Anchor>
              <Anchor
                aria-label="GitHub"
                href="https://github.com/AykutSarac/jsoncrack.com"
                fz="sm"
              >
                <ThemeIcon variant="transparent" color="gray.5">
                  <FaGithub size={20} />
                </ThemeIcon>
              </Anchor>
              <Anchor aria-label="Discord" fz="sm" href="https://discord.com/invite/yVyTtCRueq">
                <ThemeIcon variant="transparent" color="gray.5">
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
