import { Button } from "src/components/Button";
import styled from "styled-components";

export const StyledButtonWrapper = styled.div`
  display: flex;
  gap: 18px;
`;

export const StyledImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8em;
  font-family: "Roboto", sans-serif;

  * {
    box-sizing: border-box;
  }

  @media only screen and (max-width: 768px) {
    gap: 3em;
  }
`;

export const StyledGradientText = styled.span`
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

export const StyledNavbar = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 16px 16px;
  gap: 20px;

  @media only screen and (max-width: 768px) {
    a:first-of-type {
      display: none;
    }
  }
`;

export const StyledHeroSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5em;
  min-height: 40vh;
  padding: 0 3%;
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

export const StyledTitle = styled.h1`
  font-size: 5rem;
  font-weight: 900;
  margin: 0;

  @media only screen and (max-width: 768px) {
    font-size: 3rem;
  }
`;

export const StyledSubTitle = styled.h2`
  color: #dedede;
  text-align: center;
  font-size: 2.5rem;
  max-width: 40rem;
  margin: 0;

  @media only screen and (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const StyledMinorTitle = styled.p`
  color: #b4b4b4;
  text-align: center;
  font-size: 1.25rem;
  margin: 0;
  letter-spacing: 1.2px;

  @media only screen and (max-width: 992px) {
    font-size: 1rem;
  }
`;

export const StyledButton = styled(Button)`
  background: ${({ status }) => !status && "#a13cc2"};
  padding: 12px 24px;

  div {
    font-family: "Roboto", sans-serif;
    font-weight: 700;
    font-size: 16px;
  }
`;

export const StyledSponsorButton = styled(StyledButton)<{ isBlue?: boolean }>`
  background: transparent;
  border: 1px solid ${({ isBlue }) => (isBlue ? "#1F9CF0" : "#ee3d48")};
  transition: all 200ms;

  svg {
    color: ${({ isBlue }) => (isBlue ? "#1F9CF0" : "#ee3d48")};
  }

  &:hover {
    background: ${({ isBlue }) => (isBlue ? "#1F9CF0" : "#ee3d48")};

    svg {
      color: white;
    }
  }

  @media only screen and (max-width: 768px) {
    display: ${({ isBlue }) => isBlue && "none"};
  }
`;

export const StyledFeaturesSection = styled.section`
  display: flex;
  max-width: 85%;
  margin: 0 auto;
  gap: 2rem;
  padding: 50px 3%;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    max-width: 80%;
  }
`;

export const StyledSectionCard = styled.div`
  text-align: center;
  flex: 1;
`;

export const StyledCardTitle = styled.div`
  font-weight: 700;
  font-size: 1.5rem;
  padding: 1.5rem 0 0.5rem;
  letter-spacing: 1px;
`;

export const StyledCardIcon = styled.div``;

export const StyledCardDescription = styled.p`
  color: #e0e0e0;
  text-align: left;
  line-height: 1.5rem;
  font-size: 0.875rem;
`;

export const StyledIframge = styled.iframe`
  width: 100%;
  height: 100%;
  min-height: 200px;
  border: 2px solid ${({ theme }) => theme.INTERACTIVE_NORMAL};
  border-radius: 6px;

  @media only screen and (min-width: 768px) {
    min-height: 384px;
  }
`;

export const StyledSection = styled.section<{ reverse?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 85%;
  margin: 0 auto;
  gap: 4rem;
  line-height: 1.5;
  padding: 50px 3%;

  & > div {
    width: 100%;
  }

  @media only screen and (max-width: 768px) {
    flex-direction: ${({ reverse }) => (reverse ? "column-reverse" : "column")};
    max-width: 80%;
  }
`;

export const StyledSectionArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 40%;
  margin-top: 3rem;

  h2,
  p {
    text-align: left;
    letter-spacing: unset;
  }

  @media only screen and (max-width: 768px) {
    width: 100%;
    align-items: center;

    h2,
    p {
      text-align: center;
    }
  }
`;

export const StyledSponsorSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 85%;
  margin: 0 auto;
  gap: 2rem;
  line-height: 1.5;
  padding: 50px 3%;

  @media only screen and (max-width: 768px) {
    max-width: 80%;
  }
`;

export const StyledEmbedSection = styled.section`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
  max-width: 85%;
  margin: 0 auto;
  gap: 2rem;
  line-height: 1.5;
  padding: 50px 3%;

  @media only screen and (max-width: 768px) {
    max-width: 80%;
  }
`;

export const StyledPreviewSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 85%;
  margin: 0 auto;
  padding: 0 3%;

  @media only screen and (max-width: 768px) {
    display: none;
    max-width: 80%;
  }
`;

export const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0px 0px 12px rgba(255, 255, 255, 0.6));
`;

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
  color: #b4b4b4;
`;

export const StyledIconLinks = styled.div`
  display: flex;
  gap: 20px;

  ${StyledNavLink} {
    color: unset;
  }
`;

export const StyledHighlightedText = styled.span`
  text-decoration: underline;
  text-decoration-style: dashed;
  text-decoration-color: #eab308;
`;

export const StyledProducthunt = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 3rem;
  border-right: 1px solid white;
  padding-right: 3rem;

  @media only screen and (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid white;
    padding-bottom: 3rem;
    padding-right: 0;
  }
`;

export const StyledPaidSection = styled.section`
  display: flex;
  max-width: 85%;
  margin: 0 auto;
  gap: 2rem;
  padding: 50px 3%;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    max-width: 80%;
  }
`;

export const StyledAffiliate = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 3rem;
`;
