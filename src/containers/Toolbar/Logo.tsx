import React from "react";
import { Flex } from "@mantine/core";
import { JSONCrackLogo } from "src/layout/JsonCrackLogo";
import { isIframe } from "src/lib/utils/widget";
import * as Styles from "./styles";

export const Logo = () => {
  const [logoURL, setLogoURL] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const url = !isIframe()
        ? "https://jsoncrack.com"
        : window.location.href.replace("widget", "editor");

      setLogoURL(url);
    }
  }, []);

  if (!logoURL) return null;

  return (
    <Styles.StyledToolElement title="JSON Crack">
      <Flex gap="xs" align="center" justify="center">
        <JSONCrackLogo fontSize="1.2em" href={logoURL} target={isIframe() ? "_blank" : "_parent"} />
      </Flex>
    </Styles.StyledToolElement>
  );
};
