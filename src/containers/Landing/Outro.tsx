import React from "react";
import Link from "next/link";
import { Stack, Title, Button } from "@mantine/core";
import { IoArrowForward } from "react-icons/io5";

export const Outro = () => {
  return (
    <Stack align="center" mt={150}>
      <Title
        fz={{
          sm: 32,
          md: 36,
        }}
        c="gray.9"
        lts={-1}
        order={3}
        ta="center"
      >
        Designed for everyone
        <br />
        Save time understanding your data.
      </Title>

      <Button
        color="brightBlue"
        component={Link}
        prefetch={false}
        href="/#pricing"
        radius="lg"
        size="xl"
        rightSection={<IoArrowForward />}
      >
        Get Started
      </Button>
    </Stack>
  );
};
