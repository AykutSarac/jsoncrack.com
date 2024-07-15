import React from "react";
import Link from "next/link";
import { Stack, Title, Button } from "@mantine/core";

export const Outro = () => {
  return (
    <Stack align="center" my={150}>
      <Title
        fz={{
          sm: 32,
          md: 36,
        }}
        c="gray.7"
        lts={-1}
        order={3}
        ta="center"
      >
        Designed for everyone
        <br />
        Save time understanding your data.
      </Title>

      <Button
        variant="gradient"
        style={{ border: "1px solid #388cdb" }}
        component={Link}
        prefetch={false}
        href="/#pricing"
        radius="lg"
        size="xl"
      >
        Get Started
      </Button>
    </Stack>
  );
};
