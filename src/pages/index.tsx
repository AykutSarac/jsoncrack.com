import React from "react";
import { ThemeProvider } from "styled-components";
import { darkTheme } from "src/constants/theme";
import Home from "src/containers/Home";

const HomePage = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Home />
    </ThemeProvider>
  );
};

export default HomePage;
