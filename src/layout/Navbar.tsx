import React from "react";
import Link from "next/link";
import { Button } from "@mantine/core";
import styled from "styled-components";
import { JSONCrackLogo } from "./JsonCrackLogo";

const StyledNavbarWrapper = styled.div`
  z-index: 3;
  padding-top: 1rem;
  transition: background 0.2s ease-in-out;
`;

const StyledNavbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  @media only screen and (max-width: 768px) {
    padding: 16px 24px;
  }
`;

const Left = styled.div`
  width: 100%;

  @media only screen and (max-width: 768px) {
    & > *:not(:first-child) {
      display: none;
    }
  }
`;

const Right = styled.div`
  display: flex;
  gap: 16px;
`;

export const Navbar = () => {
  return (
    <StyledNavbarWrapper className="navbar">
      <StyledNavbar>
        <Left>
          <JSONCrackLogo />
          <Button
            component={Link}
            prefetch={false}
            href="/#pricing"
            variant="subtle"
            color="black"
            radius="sm"
            size="sm"
            ml={50}
            fw={500}
          >
            Pricing
          </Button>
          <Button
            component="a"
            href="https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode"
            target="_blank"
            variant="subtle"
            color="black"
            radius="sm"
            size="sm"
            fw={500}
          >
            VS Code
          </Button>
          <Button
            component={Link}
            prefetch={false}
            href="/docs"
            variant="subtle"
            color="black"
            radius="sm"
            size="sm"
            fw={500}
          >
            Docs
          </Button>
          <Button
            component={Link}
            prefetch={false}
            href="/#faq"
            variant="subtle"
            color="black"
            radius="sm"
            size="sm"
            fw={500}
          >
            FAQ
          </Button>
        </Left>
        <Right>
          <Button
            variant="default"
            component="a"
            href="https://app.jsoncrack.com/sign-in"
            radius="sm"
            visibleFrom="sm"
            size="md"
          >
            Sign in
          </Button>
          <Button
            component="a"
            color="orange"
            href="/editor"
            radius="sm"
            visibleFrom="sm"
            size="md"
          >
            Editor
          </Button>
        </Right>
      </StyledNavbar>
    </StyledNavbarWrapper>
  );
};
