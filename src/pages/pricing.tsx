import React from "react";
import { Button } from "src/components/Button";
import { Footer } from "src/components/Footer";
import { PricingCards } from "src/containers/PricingCards";
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
const Pricing = () => {
  return (
    <>
      <StyledPageWrapper>
        <Button href="/" link>
          &lt; Go Back
        </Button>
        <StyledHeroSection>
          <img src="assets/icon.png" alt="json crack" width="400" />
          <h1>Premium</h1>
        </StyledHeroSection>
        <PricingCards />
      </StyledPageWrapper>
      <Footer />
    </>
  );
};

export default Pricing;
