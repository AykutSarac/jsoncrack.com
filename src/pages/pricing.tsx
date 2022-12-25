import React from "react";
import { Button } from "src/components/Button";
import { Footer } from "src/components/Footer";
import styled from "styled-components";

const StyledPageWrapper = styled.div`
  padding: 5%;
`;

const StyledHeroSection = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const StyledPricingSection = styled.section`
  display: flex;
  justify-content: space-evenly;
  background: rgba(181, 116, 214, 0.23);
  width: 60%;
  margin: 5% auto 0;
  border-radius: 6px;
  padding: 40px 20px;
`;

const StyledPricingCard = styled.div<{ premium?: boolean }>`
  padding: 6px;
  width: 40%;

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
  text-align: center;
  font-weight: 800;
  font-size: 24px;
`;

const StyledPricingCardPrice = styled.h3`
  text-align: center;
  font-weight: 600;
  font-size: 24px;
  color: ${({ theme }) => theme.SILVER};
`;

const StyledPricingCardDetails = styled.ul`
  color: ${({ theme }) => theme.TEXT_NORMAL};
  line-height: 2.3;
`;

const StyledPricingCardDetailsItem = styled.li`
  font-weight: 500;
`;

const StyledButton = styled(Button)`
  border: 1px solid white;
`;

const Pricing = () => {
  return (
    <>
      <StyledPageWrapper>
        <StyledHeroSection>
          <img src="assets/icon.png" alt="json crack" width="400" />
          <h1>Premium</h1>
        </StyledHeroSection>
        <StyledPricingSection>
          <StyledPricingCard>
            <StyledPricingCardTitle>Free</StyledPricingCardTitle>
            <StyledPricingCardDetails>
              <StyledPricingCardDetailsItem>Store up to 20 files</StyledPricingCardDetailsItem>
              <StyledPricingCardDetailsItem>
                Create short-links for saved JSON files
              </StyledPricingCardDetailsItem>
              <StyledPricingCardDetailsItem>
                Embed saved JSON instantly
              </StyledPricingCardDetailsItem>
            </StyledPricingCardDetails>
          </StyledPricingCard>
          <StyledPricingCard premium>
            <StyledPricingCardTitle>Premium</StyledPricingCardTitle>
            <StyledPricingCardPrice>$5/mo</StyledPricingCardPrice>
            <StyledPricingCardDetails>
              <StyledPricingCardDetailsItem>
                Create and share up to 200 files
              </StyledPricingCardDetailsItem>
              <StyledPricingCardDetailsItem>Store private JSON</StyledPricingCardDetailsItem>
              <StyledPricingCardDetailsItem>
                Premium role at Discord server
              </StyledPricingCardDetailsItem>
              <StyledPricingCardDetailsItem>
                Get access to JSON Crack API to generate JSON remotely
              </StyledPricingCardDetailsItem>
              <StyledPricingCardDetailsItem>
                Everything in previous tier
              </StyledPricingCardDetailsItem>
            </StyledPricingCardDetails>
            <StyledButton href="https://www.patreon.com/jsoncrack" status="SUCCESS" block link>
              GET IT NOW!
            </StyledButton>
          </StyledPricingCard>
        </StyledPricingSection>
      </StyledPageWrapper>
      <Footer />
    </>
  );
};

export default Pricing;
