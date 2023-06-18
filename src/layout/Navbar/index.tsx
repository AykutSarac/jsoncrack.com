import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { Button } from "@mantine/core";
import { FaStar } from "react-icons/fa";
import { JSONCrackLogo } from "../JsonCrackLogo";

const StyledNavbarWrapper = styled.div`
  padding: 10px 0;
`;

const StyledNavbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90vw;
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
  return (
    <StyledNavbarWrapper>
      <StyledNavbar>
        <Left>
          <JSONCrackLogo />
        </Left>
        <Middle className="hide-mobile">
          <Button
            component="a"
            href="https://github.com/AykutSarac/jsoncrack.com"
            variant="subtle"
            color="dark"
            radius="md"
          >
            GitHub
          </Button>
          <Link href="/docs">
            <Button variant="subtle" color="dark" radius="md">
              Docs
            </Button>
          </Link>
          <Link href="/oss">
            <Button variant="subtle" color="dark" radius="md">
              Supporters
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="subtle" color="dark" radius="md">
              Pricing
            </Button>
          </Link>
        </Middle>
        <Right>
          <Button
            component="a"
            href="https://github.com/AykutSarac/jsoncrack.com"
            variant="subtle"
            radius="md"
            leftIcon={<FaStar />}
            className="desktop"
          >
            Star us on GitHub
          </Button>
          <Link href="/sign-in">
            <Button variant="light" radius="md">
              Sign In
            </Button>
          </Link>
          <Link href="/editor" prefetch={false}>
            <Button color="teal" radius="md">
              Editor
            </Button>
          </Link>
        </Right>
      </StyledNavbar>
    </StyledNavbarWrapper>
  );
};
