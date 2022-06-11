import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  HiCursorClick,
  HiLightningBolt,
  HiOutlineDownload,
  HiOutlineSearchCircle,
} from "react-icons/hi";
import { Button } from "src/components/Button";
import styled from "styled-components";

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8em;
  font-family: "Roboto", sans-serif;
`;

const StyledGradientText = styled.span`
  background: #ffb76b;
  background: linear-gradient(
    to right,
    #ffb76b 0%,
    #ffa73d 30%,
    #ff7c00 60%,
    #ff7f04 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StyledNavbar = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 16px 16px;
  gap: 20px;
`;

const StyledHeroSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5em;
  min-height: 50vh;
`;

const StyledNavLink = styled.a`
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    font-weight: 500;
    color: ${({ theme }) => theme.ORANGE};
  }
`;

const StyledTitle = styled.h1`
  font-size: 5rem;
  font-weight: 900;
  margin: 0;
`;

const StyledSubTitle = styled.h2`
  color: #dedede;
  text-align: center;
  font-size: 2.5rem;
  max-width: 40rem;
  margin: 0;
`;

const StyledMinorTitle = styled.p`
  color: #b4b4b4;
  text-align: center;
  font-size: 1.25rem;
  margin: 0;
  letter-spacing: 1.2px;
`;

const StyledButton = styled(Button)`
  background: #d0880d;
  padding: 12px 24px;

  div {
    font-family: "Roboto", sans-serif;
    font-weight: 700;
    font-size: 16px;
  }
`;

const StyledFeaturesSection = styled.section`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
`;

const StyledSectionCard = styled.div`
  text-align: center;
`;

const StyledCardTitle = styled.div`
  font-weight: 700;
  font-size: 1.5rem;
  padding: 0.875rem 0;
  letter-spacing: 1px;
`;

const StyledCardIcon = styled.div``;

const StyledCardDescription = styled.p`
  text-align: left;
  line-height: 1.5rem;
  font-size: 0.875rem;
`;

const Home: React.FC = () => {
  const { push } = useRouter();

  return (
    <StyledHome>
      <StyledNavbar>
        <Link href="/editor">
          <StyledNavLink>Editor</StyledNavLink>
        </Link>
        <Link href="#features">
          <StyledNavLink>Features</StyledNavLink>
        </Link>
        <Link href="#sponsor">
          <StyledNavLink>Sponsor</StyledNavLink>
        </Link>
        <Link href="https://github.com/AykutSarac/jsonvisio.com">
          <StyledNavLink target="_blank" rel="external">
            GitHub
          </StyledNavLink>
        </Link>
      </StyledNavbar>

      <StyledHeroSection id="features">
        <StyledTitle>
          <StyledGradientText>JSON</StyledGradientText> Visio
        </StyledTitle>
        <StyledSubTitle>
          Seamlessly visualize your JSON data instantly into graphs.
        </StyledSubTitle>
        <StyledMinorTitle>Paste - Import - Fetch!</StyledMinorTitle>
        <StyledButton onClick={() => push("/editor")}>GET STARTED</StyledButton>
      </StyledHeroSection>

      <StyledFeaturesSection>
        <StyledSectionCard>
          <StyledCardIcon>
            <HiCursorClick size={50} color="#3BA55D" />
          </StyledCardIcon>
          <StyledCardTitle>SEAMLESS</StyledCardTitle>
          <StyledCardDescription>
            What good is a powerful table if that super hip designer you just
            hired can't work their UI magic on it? TanStack Table is headless by
            design, which means 100% control down to the very smallest HTML tag,
            component, class and style. Pixel Perfection? Go for it!
          </StyledCardDescription>
        </StyledSectionCard>

        <StyledSectionCard>
          <StyledCardIcon>
            <HiOutlineSearchCircle size={50} color="#5865F2" />
          </StyledCardIcon>
          <StyledCardTitle>SEARCH</StyledCardTitle>
          <StyledCardDescription>
            What good is a powerful table if that super hip designer you just
            hired can't work their UI magic on it? TanStack Table is headless by
            design, which means 100% control down to the very smallest HTML tag,
            component, class and style. Pixel Perfection? Go for it!
          </StyledCardDescription>
        </StyledSectionCard>

        <StyledSectionCard>
          <StyledCardIcon>
            <HiOutlineDownload size={50} color="#DA2877" />
          </StyledCardIcon>
          <StyledCardTitle>DOWNLOAD</StyledCardTitle>
          <StyledCardDescription>
            What good is a powerful table if that super hip designer you just
            hired can't work their UI magic on it? TanStack Table is headless by
            design, which means 100% control down to the very smallest HTML tag,
            component, class and style. Pixel Perfection? Go for it!
          </StyledCardDescription>
        </StyledSectionCard>

        <StyledSectionCard>
          <StyledCardIcon>
            <HiLightningBolt size={50} color="#F5E027" />
          </StyledCardIcon>
          <StyledCardTitle>LIVE</StyledCardTitle>
          <StyledCardDescription>
            What good is a powerful table if that super hip designer you just
            hired can't work their UI magic on it? TanStack Table is headless by
            design, which means 100% control down to the very smallest HTML tag,
            component, class and style. Pixel Perfection? Go for it!
          </StyledCardDescription>
        </StyledSectionCard>
      </StyledFeaturesSection>
    </StyledHome>
  );
};

export default Home;
