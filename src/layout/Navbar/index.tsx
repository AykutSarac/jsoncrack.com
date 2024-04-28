import React from "react";
import Link from "next/link";
import { Box, Burger, Button, Flex, Overlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import styled from "styled-components";
import useUser from "src/store/useUser";
import { JSONCrackLogo } from "../JsonCrackLogo";

const StyledNavbarWrapper = styled.div`
  z-index: 3;
  transition: background 0.2s ease-in-out;
`;

const StyledNavbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 56px;
  margin: 0 auto;
  padding: 46px 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  @media only screen and (max-width: 768px) {
    padding: 16px 24px;
  }

  @media only screen and (max-width: 1024px) {
    .desktop {
      display: none;
    }
  }

  @media only screen and (max-width: 768px) {
    .hide-mobile {
      display: none;
    }
  }
`;

const Left = styled.div``;

const Right = styled.div`
  display: flex;
  gap: 16px;
`;

export const Navbar = () => {
  const hasSession = useUser(state => !!state.user);
  const premium = useUser(state => state.premium);
  const [opened, { toggle }] = useDisclosure();

  return (
    <StyledNavbarWrapper className="navbar">
      <StyledNavbar>
        <Left>
          <JSONCrackLogo />
          <Button
            ml="lg"
            component="a"
            href="https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode"
            target="_blank"
            variant="subtle"
            color="gray"
            radius="md"
            visibleFrom="sm"
            size="md"
            fw="normal"
          >
            VS Code
          </Button>
          <Button
            component={Link}
            href="/pricing"
            variant="subtle"
            color="gray"
            radius="md"
            visibleFrom="sm"
            size="md"
            fw="normal"
          >
            Pricing
          </Button>
          <Button
            component={Link}
            prefetch={false}
            href="/docs"
            variant="subtle"
            color="gray"
            radius="md"
            visibleFrom="sm"
            size="md"
            fw="normal"
          >
            Docs
          </Button>
        </Left>
        <Right>
          {!hasSession && (
            <>
              <Button
                component="a"
                href="https://app.jsoncrack.com/sign-in"
                variant="outline"
                color="gray"
                className="hide-mobile"
                radius="md"
                visibleFrom="sm"
                size="md"
              >
                Login
              </Button>
              <Button
                component={Link}
                prefetch={false}
                href={premium ? "https://app.jsoncrack.com/editor" : "/editor"}
                color="dark"
                className="hide-mobile"
                visibleFrom="sm"
                radius="md"
                size="md"
              >
                Editor
              </Button>
            </>
          )}
          {hasSession && (
            <Button
              color="dark"
              size="md"
              radius="md"
              component={Link}
              href="/editor"
              prefetch={false}
              visibleFrom="sm"
            >
              Editor
            </Button>
          )}
          <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" hiddenFrom="sm" />
          {opened && (
            <Overlay top={56} h="100dvh">
              <Box
                bg="white"
                top={56}
                left={0}
                pos="fixed"
                w="100%"
                pb="lg"
                style={{ zIndex: 3, borderBottom: "1px solid black" }}
              >
                <Flex pt="lg" direction="column" align="center" justify="center" gap="lg">
                  <Button
                    component={Link}
                    href="/pricing"
                    variant="transparent"
                    color="dark"
                    radius="md"
                    onClick={toggle}
                  >
                    Pricing
                  </Button>
                </Flex>
              </Box>
            </Overlay>
          )}
        </Right>
      </StyledNavbar>
    </StyledNavbarWrapper>
  );
};
