import React from "react";
import styled from "styled-components";
import { Button } from "@mantine/core";

const StyledPremiumView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  img {
    filter: drop-shadow(2px 4px 6px black);
  }
`;

const StyledTitle = styled.h2`
  font-size: 48px;
  margin-bottom: 0;
  background: linear-gradient(to right, #cf0642 0%, #9344cf 100%);
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 3px black;
  -webkit-background-clip: text;
`;

const StyledInfo = styled.p`
  width: 60%;
  font-weight: 600;
  font-size: 20px;
  text-align: center;
  color: ${({ theme }) => theme.TEXT_NORMAL};
`;

export const PremiumView = () => (
  <StyledPremiumView>
    <StyledTitle>PLAY BIG!</StyledTitle>
    <StyledInfo>
      Upgrade JSON Crack to premium and explore & unlock full potantial of your data!
    </StyledInfo>
    <Button
      size="lg"
      component="a"
      variant="gradient"
      gradient={{ from: "purple", to: "pink" }}
      href="https://www.patreon.com/herowand"
      target="_blank"
      style={{ border: "2px solid black" }}
    >
      DO IT!
    </Button>
    <img src="/assets/undraw_to_the_stars_re_wq2x.svg" width="300" height="300" alt="oops" />
  </StyledPremiumView>
);
