import React from "react";
import { Image } from "@mantine/core";
import styled from "styled-components";

const StyledImageWrapper = styled.div`
  max-width: 85%;
  margin: 0 auto;
  filter: drop-shadow(0px -4px 10px rgba(70, 70, 70, 0.25));

  @media only screen and (max-width: 768px) {
    max-width: 85%;
    margin: 0 auto;
  }
`;

export const HeroPreview = () => {
  return (
    <StyledImageWrapper id="preview">
      <Image
        loading="eager"
        src="./assets/compare/free.webp"
        alt="JSON Crack Preview"
        w="100%"
        h="100%"
        radius="md"
      />
    </StyledImageWrapper>
  );
};
