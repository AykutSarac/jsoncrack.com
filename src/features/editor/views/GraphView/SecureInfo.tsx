import React from "react";
import { ThemeIcon, Tooltip } from "@mantine/core";
import { LuShieldCheck } from "react-icons/lu";

export const SecureInfo = () => {
  return (
    <Tooltip
      label="Your data is processed locally on your device."
      fz="xs"
      ta="center"
      maw="200"
      multiline
      withArrow
    >
      <ThemeIcon
        variant="light"
        color="teal"
        size="36"
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          zIndex: 100,
        }}
        radius="xl"
      >
        <LuShieldCheck size="22" />
      </ThemeIcon>
    </Tooltip>
  );
};
