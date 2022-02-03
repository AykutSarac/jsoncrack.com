import Link from "next/link";
import React from "react";
import { AiFillGithub, AiOutlineTwitter } from "react-icons/ai";
import styled from "styled-components";
import pkg from "../../../package.json";

const StyledFooter = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  color: ${({ theme }) => theme.SILVER};
`;

const StyledVersion = styled.pre`
  margin-top: 0;
`;

const StyledSocial = styled.div`
  display: flex;
  gap: 14px;
  font-size: 26px;
`;

export const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <StyledSocial>
        <Link href="https://github.com/AykutSarac/jsonvisio.com">
          <a rel="me" target="_blank">
            <AiFillGithub />
          </a>
        </Link>
        <Link href="https://twitter.com/aykutsarach">
          <a rel="me" target="_blank">
            <AiOutlineTwitter />
          </a>
        </Link>
      </StyledSocial>
      <StyledVersion>{pkg.version}</StyledVersion>
    </StyledFooter>
  );
};
