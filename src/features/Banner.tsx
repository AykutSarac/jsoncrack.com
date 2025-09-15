import React, { useEffect, useState } from "react";
import { Anchor, Flex, Button } from "@mantine/core";

export const BANNER_HEIGHT =
  process.env.NEXT_PUBLIC_DISABLE_EXTERNAL_MODE === "true" ? "0px" : "40px";

const BANNER_LIST = [
  "Save and store your diagrams with ToDiagram",
  "Explore the ToDiagram from the creators of JSON Crack",
  "Generate AI diagrams with single prompt",
  "Try ToDiagram for free, no sign-up required",
  "Edit data directly inside diagrams",
  "Explore larger datasets (up to 50 MB) easily",
];

export const Banner = () => {
  const ROTATION_INTERVAL = 6000; // ms between label changes
  const FADE_DURATION = 500; // ms for fade transition

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let fadeTimeout: ReturnType<typeof setTimeout> | undefined;
    const intervalId = setInterval(() => {
      setVisible(false);
      fadeTimeout = setTimeout(() => {
        setIndex(i => (i + 1) % BANNER_LIST.length);
        setVisible(true);
      }, FADE_DURATION);
    }, ROTATION_INTERVAL);

    return () => {
      clearInterval(intervalId);
      if (fadeTimeout) clearTimeout(fadeTimeout);
    };
  }, []);

  return (
    <Anchor
      href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=top_banner"
      target="_blank"
      rel="noopener"
      underline="never"
    >
      <Flex
        h={BANNER_HEIGHT}
        justify="center"
        align="center"
        fw="500"
        gap="xs"
        style={{
          background: "linear-gradient(90deg, #FF75B7 0%, #FED761 100%)",
          color: "black",
        }}
      >
        <span
          style={{
            transition: `opacity ${FADE_DURATION}ms ease`,
            opacity: visible ? 1 : 0,
            willChange: "opacity",
            display: "inline-block",
          }}
        >
          {BANNER_LIST[index]}{" "}
        </span>
        <Button size="xs" color="gray">
          Try now
        </Button>
      </Flex>
    </Anchor>
  );
};
