import Link from "next/link";
import React from "react";
import styled from "styled-components";

interface NavbarProps {
  isWide?: boolean;
}

const StyledNavbar = styled.div`
  display: flex;
  justify-content: space-between;
  width: 75%;
  margin: 0 auto 20px;
`;

const StyledLogo = styled.div`
  position: relative;
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
  font-weight: 700;
  color: #ffffff;
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-evenly;
  gap: 20px;
`;

const StyledTitleWrapper = styled.span`
  color: ${({ theme }) => theme.ORANGE};
`;

const StyledBetaText = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(85%, -25%);
  color: ${({ theme }) => theme.BLURPLE};
  font-size: 12px;
  font-weight: 400;
`;

export const Navbar: React.FC<NavbarProps> = () => {
  return (
    <StyledNavbar>
      <Link href="/">
        <a>
          <StyledLogo>
            <StyledTitleWrapper>JSON</StyledTitleWrapper> Visio
            <StyledBetaText>BETA!</StyledBetaText>
          </StyledLogo>
        </a>
      </Link>
      <StyledNav>
        <Link href="/editor">
          <a>Editor</a>
        </Link>
        <Link href="https://github.com/AykutSarac/jsonvisio.com">
          <a>GitHub</a>
        </Link>
      </StyledNav>
    </StyledNavbar>
  );
};
