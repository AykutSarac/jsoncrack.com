import React from "react";
import { Flex, Image, Paper, SegmentedControl, Stack } from "@mantine/core";
import styled from "styled-components";
import { images } from "src/constants/landing";

const StyledPreviewWrapper = styled.div`
  margin: 0 auto;
  position: relative;

  @media only screen and (max-width: 996px) {
    display: none;
  }
`;

export const HeroPreview = () => {
  const [selectedFeature, setSelectedFeature] = React.useState("1");

  return (
    <StyledPreviewWrapper id="preview">
      <Flex gap="lg" mx="auto" w="85%">
        <Stack>
          <SegmentedControl
            data={[
              {
                label: "Fast & Compact",
                value: "1",
              },
              {
                label: "Search",
                value: "2",
              },
              {
                label: "Edit",
                value: "3",
              },
              {
                label: "Customize",
                value: "5",
              },
              {
                label: "Compare",
                value: "6",
              },
              {
                label: "AI-Powered Assistant",
                value: "7",
              },
            ]}
            value={selectedFeature}
            onChange={setSelectedFeature}
            orientation="vertical"
            withItemsBorders={false}
            color="teal"
            bg="transparent"
            size="lg"
            styles={{
              control: {
                background: "#67676714",
                borderRadius: "4px",
              },
              root: {
                gap: "24px",
              },
            }}
          />
        </Stack>
        <Paper
          bg="transparent"
          w="100%"
          p={0}
          radius="md"
          style={{ overflow: "hidden", border: "1px solid #d5d5d5" }}
          shadow="md"
        >
          <Image
            fit="cover"
            src={`./assets/preview/${selectedFeature}.webp`}
            loading={selectedFeature === "1" ? "eager" : "lazy"}
            alt={images[+selectedFeature - 1].alt}
            h="100%"
          />
        </Paper>
      </Flex>
    </StyledPreviewWrapper>
  );
};
