import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { Button } from "@mantine/core";
import useUser from "src/store/useUser";
import { JSONCrackLogo } from "../JsonCrackLogo";

const StyledNavbarWrapper = styled.div`
  padding: 10px 0;
`;

const StyledNavbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90vw;
  height: 56px;
  margin: 0 auto;
  border: 2px solid black;
  background: white;
  padding: 8px 16px;
  border-radius: 30px;

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

const Middle = styled.div``;

const Right = styled.div`
  display: flex;
  gap: 16px;
`;

export const Navbar = () => {
  const isAuthenticated = useUser(state => state.isAuthenticated);

  return (
    <StyledNavbarWrapper>
      <StyledNavbar>
        <Left>
          <JSONCrackLogo />
        </Left>
        <Middle className="hide-mobile">
          <Button
            component={Link}
            href="/pricing"
            prefetch={false}
            variant="subtle"
            color="dark"
            radius="md"
          >
            Pricing
          </Button>
          <Button
            component={Link}
            href="https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode"
            prefetch={false}
            variant="subtle"
            color="dark"
            radius="md"
          >
            VS Code
          </Button>
          <Button
            component={Link}
            href="/docs"
            prefetch={false}
            variant="subtle"
            color="dark"
            radius="md"
          >
            Docs
          </Button>
        </Middle>
        <Right>
          {!isAuthenticated && (
            <Button
              component={Link}
              href="/sign-in"
              prefetch={false}
              variant="light"
              radius="md"
              className="hide-mobile"
            >
              Sign In
            </Button>
          )}
          <Button component={Link} href="/editor" prefetch={false} color="pink" radius="md">
            Editor
          </Button>
        </Right>
      </StyledNavbar>
    </StyledNavbarWrapper>
  );
};
