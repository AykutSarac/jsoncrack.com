import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { AiFillHome } from "react-icons/ai";

const StyledSidebar = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 60px;
  background: #2f3136;
  padding: 8px;
`;

const StyledElement = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  border-bottom: 1px solid ${({ theme }) => theme.SILVER};
  font-weight: 700;
  width: 100%;
  color: ${({ theme }) => theme.SILVER};

  a {
    text-align: center;
    width: 100%;
  }

  svg {
    vertical-align: middle;
  }
`;

const StyledTitleWrapper = styled.span`
  color: ${({ theme }) => theme.ORANGE};
`;

const StyledTopWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StyledBottomWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StyledLogo = styled.div`
  color: ${({ theme }) => theme.FULL_WHITE};
`;

export const Sidebar = () => {
  return (
    <StyledSidebar>
      <StyledTopWrapper>
        <StyledElement>
          <Link href="/">
            <a>
              <StyledLogo>
                <StyledTitleWrapper>J</StyledTitleWrapper>S
              </StyledLogo>
            </a>
          </Link>
        </StyledElement>
        <StyledElement>
          <Link href="/">
            <a>
              <AiFillHome />
            </a>
          </Link>
        </StyledElement>
      </StyledTopWrapper>
      <StyledBottomWrapper></StyledBottomWrapper>
    </StyledSidebar>
  );
};
