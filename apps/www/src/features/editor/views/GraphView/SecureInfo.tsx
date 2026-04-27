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
        size="32"
        style={{
          position: "absolute",
          bottom: "14px",
          right: "14px",
          zIndex: 3,
          backdropFilter: "blur(12px)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(20, 184, 166, 0.15)",
        }}
        radius="xl"
      >
        <LuShieldCheck size="18" />
      </ThemeIcon>
    </Tooltip>
  );
};
