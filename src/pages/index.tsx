import React from "react";
import { darkTheme } from "src/constants/theme";
import Home from "src/containers/Home";
import { ThemeProvider } from "styled-components";

const HomePage = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Home />
    </ThemeProvider>
  );
};

export default HomePage;
