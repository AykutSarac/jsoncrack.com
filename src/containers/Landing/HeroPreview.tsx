import React from "react";
import { Container, Image } from "@mantine/core";

export const HeroPreview = () => {
  return (
    <Container component="section" id="preview" fluid mx="lg">
      <Image
        src="./assets/preview/free.webp"
        loading="eager"
        maw={1036}
        mx="auto"
        alt="JSON Crack editor preview"
        style={{
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid #c1c1c1",
          outline: "1px solid #c1c1c1",
          outlineOffset: "6px",
        }}
      />
    </Container>
  );
};
