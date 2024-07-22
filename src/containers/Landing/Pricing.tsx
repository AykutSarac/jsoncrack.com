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
          base: 24,
          xs: 30,
          sm: 36,
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
