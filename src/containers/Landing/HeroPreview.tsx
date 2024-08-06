import React from "react";
import { AspectRatio, Flex, Paper, SegmentedControl, Stack, Text } from "@mantine/core";
import styled from "styled-components";

const StyledPreviewWrapper = styled.div`
  margin: 0 auto;
  position: relative;
  padding: 5rem 0;
`;

const features = [
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
];

export const HeroPreview = () => {
  const [selectedFeature, setSelectedFeature] = React.useState("1");

  return (
    <StyledPreviewWrapper id="preview">
      <Flex
        gap="lg"
        direction={{
          base: "column",
          xs: "row",
        }}
        mx="auto"
        maw={{
          base: "90%",
          xs: "85%",
        }}
        justify="center"
      >
        <Stack>
          <SegmentedControl
            data={features}
            value={selectedFeature}
            onChange={setSelectedFeature}
            orientation="vertical"
            withItemsBorders={false}
            bg="transparent"
            color="orange.7"
            size="lg"
            visibleFrom="sm"
            styles={{
              control: {
                background: "rgba(168, 168, 168, 0.2)",
                borderRadius: "4px",
              },
              root: {
                gap: "24px",
              },
            }}
          />
        </Stack>
        <Stack w="100%">
          <Paper
            p={0}
            w="100%"
            maw={1440}
            h="fit-content"
            radius="lg"
            shadow="xl"
            bg="transparent"
            style={{
              overflow: "hidden",
              border: "1px solid #c1c1c1",
              outline: "1px solid #c1c1c1",
              outlineOffset: "4px",
            }}
          >
            <AspectRatio ratio={1440 / 760} maw={1440} w="100%" h="100%">
              <video
                autoPlay
                muted
                loop
                preload="auto"
                playsInline
                poster={`./assets/preview/${selectedFeature}.webp`}
                key={selectedFeature}
                style={{ display: "block" }}
              >
                <source
                  src={`https://app.jsoncrack.com/assets/videos/p${selectedFeature}.mp4`}
                  type="video/mp4"
                />
              </video>
            </AspectRatio>
          </Paper>
          <Text c="gray.6" fz="sm" ta="center">
            Previews are from the Premium version of the app
          </Text>
        </Stack>
      </Flex>
    </StyledPreviewWrapper>
  );
};
