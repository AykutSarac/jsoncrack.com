import React from "react";
import { Container, Title } from "@mantine/core";
import { PricingCards } from "src/pages/pricing";

export const Pricing = () => {
  return (
    <Container component="section" id="pricing" my={150} fluid>
      <Title
        c="black"
        order={2}
        fz={{
          base: 26,
          xs: 32,
          sm: 42,
        }}
        fw={600}
        mb={15}
        ta="center"
      >
        Pricing
      </Title>
      <PricingCards />
    </Container>
  );
};
