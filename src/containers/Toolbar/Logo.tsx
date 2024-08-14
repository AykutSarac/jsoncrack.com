import React from "react";
import { JSONCrackLogo } from "src/layout/JsonCrackLogo";
import * as Styles from "./styles";

export const Logo = () => {
  return (
    <Styles.StyledToolElement title="JSON Crack">
      <JSONCrackLogo fontSize="1.2rem" hideText />
    </Styles.StyledToolElement>
  );
};
