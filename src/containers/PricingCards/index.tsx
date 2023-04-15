import React from "react";
import styled from "styled-components";
import { Button } from "@mantine/core";

const StyledSectionBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 50px;
  align-items: center;
  justify-content: space-between;
  background: rgba(181, 116, 214, 0.23);
  width: 80%;
  margin: 5% auto 0;
  border-radius: 6px;
  padding: 50px;

  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    padding: 20px;
  }
`;

const StyledPricingCard = styled.div<{ premium?: boolean }>`
  padding: 6px;
  width: 100%;
  height: 100%;

  ${({ premium }) =>
    premium
      ? `
      background: rgba(255, 5, 214, 0.19);
border-radius: 4px;
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(5px);
-webkit-backdrop-filter: blur(5px);
border: 1px solid rgba(255, 5, 214, 0.74);`
      : `background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);`};
`;

const StyledPricingCardTitle = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 800;
  font-size: 24px;
  gap: 6px;

  img {
    transform: rotate(45deg);
  }
`;

const StyledPricingCardPrice = styled.h3`
  text-align: center;
  font-weight: 600;
  font-size: 24px;
  color: ${({ theme }) => theme.SILVER};
`;

const StyledPricingCardDetails = styled.ul`
  color: ${({ theme }) => theme.FULL_WHITE};
  line-height: 2.3;
  padding: 20px;
`;

const StyledPricingCardDetailsItem = styled.li`
  font-weight: 500;

  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const StyledPricingSection = styled.section`
  margin: 0 auto;

  h1 {
    text-align: center;
    padding-bottom: 25px;
  }
`;

export const PricingCards = () => {
  return (
    <StyledPricingSection>
      <h1>Unlock Full Potential of JSON Crack</h1>
      <StyledSectionBody>
        <StyledPricingCard>
          <StyledPricingCardTitle>Free</StyledPricingCardTitle>
          <StyledPricingCardDetails>
            <StyledPricingCardDetailsItem>Store up to 15 files</StyledPricingCardDetailsItem>
            <StyledPricingCardDetailsItem>
              Create short-links for saved JSON files
            </StyledPricingCardDetailsItem>
            <StyledPricingCardDetailsItem>Embed saved JSON instantly</StyledPricingCardDetailsItem>
          </StyledPricingCardDetails>
        </StyledPricingCard>
        <StyledPricingCard premium>
          <StyledPricingCardTitle>Premium</StyledPricingCardTitle>
          <StyledPricingCardPrice>$5/mo</StyledPricingCardPrice>
          <StyledPricingCardDetails>
            <StyledPricingCardDetailsItem>
              Create and share up to 200 files
            </StyledPricingCardDetailsItem>
            <StyledPricingCardDetailsItem>
              Get access to JSON Crack API to generate JSON remotely
            </StyledPricingCardDetailsItem>
            <StyledPricingCardDetailsItem>Everything in previous tier</StyledPricingCardDetailsItem>
          </StyledPricingCardDetails>
          <Button
            size="md"
            variant="gradient"
            gradient={{ from: "pink", to: "red", deg: 105 }}
            component="a"
            href="https://www.patreon.com/herowand"
            target="_blank"
            fullWidth
            style={{
              border: "2px solid black",
            }}
          >
            GET PREMIUM
          </Button>
        </StyledPricingCard>
      </StyledSectionBody>
    </StyledPricingSection>
  );
};
