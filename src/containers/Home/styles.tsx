import Link from "next/link";
import styled from "styled-components";

export const StyledButtonWrapper = styled.div`
  display: flex;
  gap: 18px;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

export const StyledTwitterQuote = styled.div`
  width: 100%;
  height: 100%;

  blockquote.twitter-tweet {
    display: inline-block;
    font-family: "Helvetica Neue", Roboto, "Segoe UI", Calibri, sans-serif;
    font-size: 12px;
    font-weight: bold;
    line-height: 16px;
    border-color: #eee #ddd #bbb;
    border-radius: 5px;
    border-style: solid;
    border-width: 1px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    margin: 10px 5px;
    padding: 0 16px 16px 16px;
    max-width: 468px;
  }

  blockquote.twitter-tweet p {
    font-size: 16px;
    font-weight: normal;
    line-height: 20px;
  }

  blockquote.twitter-tweet a {
    color: inherit;
    font-weight: normal;
    text-decoration: none;
    outline: 0 none;
  }

  blockquote.twitter-tweet a:hover,
  blockquote.twitter-tweet a:focus {
    text-decoration: underline;
  }
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

  * {
    box-sizing: border-box;
  }

  @media only screen and (max-width: 768px) {
    gap: 3em;
  }
`;

export const StyledGradientText = styled.span`
  background: #ffb76b;
  background: linear-gradient(to right, #ffb76b 0%, #ffa73d 30%, #ff7c00 60%, #ff7f04 100%);
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

  h2 {
    margin-bottom: 25px;
  }
`;

export const StyledNavLink = styled(Link)`
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
  font-weight: 900;
  margin: 0;
  font-size: min(6vw, 86px);
  color: white;
  font-family: var(--mona-sans);

  @media only screen and (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const StyledSubTitle = styled.h2`
  color: #dedede;
  text-align: center;
  font-size: 2.5rem;
  max-width: 40rem;
  margin: 0;

  @media only screen and (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const StyledMinorTitle = styled.p`
  color: #b4b4b4;
  text-align: center;
  font-size: 1rem;
  margin: 0;
  letter-spacing: 1.2px;

  @media only screen and (max-width: 992px) {
    font-size: 1rem;
  }
`;

export const StyledFeaturesSection = styled.section`
  display: grid;
  margin: 0 auto;
  max-width: 80%;
  justify-content: center;
  grid-template-columns: repeat(2, 40%);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 60px;
  grid-row-gap: 60px;

  @media only screen and (min-width: 1024px) {
    max-width: 60%;
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    max-width: 80%;
    display: flex;
  }
`;

export const StyledSectionCard = styled.div`
  text-align: center;
  flex: 1;
  border: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  background: rgb(48, 0, 65);
  background: linear-gradient(
    138deg,
    rgba(48, 0, 65, 0.8870141806722689) 0%,
    rgba(72, 12, 84, 0.40802258403361347) 33%,
    rgba(65, 8, 92, 0.6012998949579832) 100%
  );
  border-radius: 6px;
  padding: 16px;
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

export const StyledFrame = styled.iframe`
  width: 100%;
  height: 100%;
  min-height: 200px;
  border: 2px solid ${({ theme }) => theme.PRIMARY};
  border-radius: 6px;

  @media only screen and (min-width: 768px) {
    min-height: 384px;
  }
`;

export const StyledPreviewFrame = styled(StyledFrame)`
  border: none;
  border-left: 2px solid ${({ theme }) => theme.PRIMARY};
  border-radius: 0;
  height: 476px;
  width: 50%;
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

  @media only screen and (max-width: 1200px) {
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

    h2 {
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
    max-width: 90%;
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
  width: 70%;
  margin: 0 auto;
  background: ${({ theme }) => theme.BLACK_SECONDARY};
  border: 2px solid ${({ theme }) => theme.PRIMARY};
  border-radius: 6px;
  overflow: hidden;
  height: 480px;

  @media only screen and (max-width: 992px) {
    display: none;
  }
`;

export const StyledHighlightWrapper = styled.div`
  width: 50%;
`;

export const StyledTabsWrapper = styled.div`
  display: flex;
  gap: 10px;
  padding: 8px 8px;
  padding-bottom: 0;
  height: 34px;

  pre {
    border-top: 2px solid ${({ theme }) => theme.PRIMARY};
  }
`;

export const StyledTab = styled.button<{ active?: boolean }>`
  border-radius: 6px 6px 0 0;
  background: ${({ active }) => active && "#1e1e1e"};
  border: 2px solid ${({ theme, active }) => (active ? theme.PRIMARY : "transparent")};
  border-bottom: 0;
  margin-bottom: -2px;
  padding: 4px 8px;
  min-width: 80px;
  max-width: 150px;
  color: ${({ theme, active }) => (active ? theme.INTERACTIVE_ACTIVE : theme.INTERACTIVE_NORMAL)};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: 600;

  &:hover {
    color: ${({ theme, active }) => !active && theme.INTERACTIVE_HOVER};
  }
`;

export const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0px 0px 12px rgba(255, 255, 255, 0.6));
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
