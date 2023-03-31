import Link from "next/link";
import styled from "styled-components";
import { FaDiscord, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import pkg from "../../../package.json";

export const StyledFooter = styled.footer`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80%;
  margin: 0 auto;
  padding: 30px 3%;
  border-top: 1px solid #b4b4b4;
  opacity: 0.7;
`;

export const StyledFooterText = styled.p`
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #b4b4b4;
`;

export const StyledNavLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    font-weight: 500;
    color: ${({ theme }) => theme.ORANGE};
  }
`;

export const StyledIconLinks = styled.div`
  display: flex;
  gap: 20px;
`;

export const Footer = () => (
  <StyledFooter>
    <StyledFooterText>
      <Link href="/">
        <img width="120" height="20" src="assets/icon.png" alt="icon" loading="lazy" />
      </Link>
      <span>
        © {new Date().getFullYear()} JSON Crack - {pkg.version}
      </span>
    </StyledFooterText>
    <StyledIconLinks>
      <StyledNavLink
        href="https://github.com/AykutSarac/jsoncrack.com"
        rel="external"
        target="_blank"
        aria-label="github"
      >
        <FaGithub size={26} />
      </StyledNavLink>

      <StyledNavLink
        href="https://www.linkedin.com/in/aykutsarac/"
        rel="me"
        target="_blank"
        aria-label="linkedin"
      >
        <FaLinkedin size={26} />
      </StyledNavLink>

      <StyledNavLink
        href="https://twitter.com/jsoncrack"
        rel="me"
        target="_blank"
        aria-label="twitter"
      >
        <FaTwitter size={26} />
      </StyledNavLink>

      <StyledNavLink
        href="https://discord.gg/yVyTtCRueq"
        rel="noreferrer"
        target="_blank"
        aria-label="discord"
      >
        <FaDiscord size={26} />
      </StyledNavLink>
    </StyledIconLinks>
  </StyledFooter>
);
