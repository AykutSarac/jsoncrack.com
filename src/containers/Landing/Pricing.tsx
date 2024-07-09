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
          sm: 32,
          md: 42,
        }}
        fw={600}
        mt={150}
        mb={15}
        ta="center"
      >
        Pricing
      </Title>
      <PricingCards />
    </Container>
  );
};
