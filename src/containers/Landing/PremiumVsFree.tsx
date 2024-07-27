import React from "react";
import { Title, Overlay, Paper, rem, Image, Text, Container } from "@mantine/core";
import styled from "styled-components";
import { ReactCompareSlider, ReactCompareSliderHandle } from "react-compare-slider";

const StyledImageWrapper = styled.div`
  max-width: 85%;
  margin: 0 auto;
  filter: drop-shadow(0px -4px 10px rgba(70, 70, 70, 0.25));

  @media only screen and (max-width: 768px) {
    max-width: 85%;
    margin: 0 auto;
  }
`;

export const PremiumVsFree = () => {
  const [labelOpacity, setLabelOpacity] = React.useState(1);
  const labelStyle = {
    fontSize: "1rem",
    position: "absolute" as any,
    padding: "6px 12px",
    margin: "0 -6px",
    color: "white",
    opacity: labelOpacity,
    borderRadius: ".25rem",
    border: "1px solid white",
    backdropFilter: "blur(0.25rem) saturate(180%) contrast(80%) brightness(120%)",
    WebkitBackdropFilter: "blur(0.25rem) saturate(180%) contrast(80%) brightness(120%)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    transition: "opacity 0.25s ease-in-out",
  };

  return (
    <Container pos="relative" component="section" id="premium" fluid my={120}>
      <Paper
        pb={rem(260)}
        px={{
          sm: rem(10),
          md: rem(80),
        }}
        pt={rem(20)}
        maw={{
          xs: "95%",
        }}
        radius="xl"
        mx="auto"
        mb="-18rem"
        style={{
          textAlign: "center",
          background: "linear-gradient(rgb(207, 116, 3) 40%, rgb(255, 255, 255) 90%)",
        }}
      >
        <Title
          c="white"
          order={2}
          fz={{
            base: 24,
            xs: 30,
            sm: 36,
          }}
          fw={700}
          mb="md"
        >
          Premium vs Free
        </Title>
        <Text
          mx="auto"
          fz={{
            base: 14,
            xs: 16,
          }}
          maw={{
            base: "60%",
            sm: "50%",
          }}
          c="gray.2"
          mb={60}
        >
          Designed to help you navigate through your data with ease. <br /> Smaller, faster, and
          more efficient than ever before.
        </Text>
      </Paper>

      <StyledImageWrapper>
        <ReactCompareSlider
          onPointerDown={() => setLabelOpacity(0)}
          onPointerUp={() => setLabelOpacity(1)}
          style={{
            border: "1px solid #d5d5d5",
            borderRadius: 12,
          }}
          itemOne={<Image loading="lazy" src="./assets/preview/1.webp" alt="Pro" />}
          itemTwo={
            <>
              <Overlay color="#000" backgroundOpacity={0.1} />
              <Image loading="lazy" src="./assets/preview/free.webp" alt="Free" />
            </>
          }
          handle={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              <ReactCompareSliderHandle />
              <div
                style={{
                  ...labelStyle,
                  translate: "-100% 0",
                  left: 0,
                }}
              >
                Premium
              </div>
              <div
                style={{
                  ...labelStyle,
                  translate: "100% 0",
                  right: 0,
                }}
              >
                Free
              </div>
            </div>
          }
        />
      </StyledImageWrapper>
    </Container>
  );
};
