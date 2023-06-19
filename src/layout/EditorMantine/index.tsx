import React from "react";
import { ThemeProvider } from "styled-components";
import { MantineProvider } from "@mantine/core";
import { monaSans } from "src/constants/customFonts";
import { lightTheme, darkTheme } from "src/constants/theme";
import useStored from "src/store/useStored";

export const EditorMantine: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lightmode = useStored(state => state.lightmode);

  return (
    <ThemeProvider theme={lightmode ? lightTheme : darkTheme}>
      <MantineProvider
        withCSSVariables
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: lightmode ? "light" : "dark",
          fontFamily: monaSans.style.fontFamily,
          headings: {
            fontFamily: monaSans.style.fontFamily,
          },
          components: {
            Divider: {
              styles: () => ({
                root: {
                  borderTopColor: "#4D4D4D !important",
                },
              }),
            },
            Modal: {
              styles: theme => ({
                title: {
                  fontWeight: 700,
                },
                header: {
                  backgroundColor: theme.colorScheme === "dark" ? "#36393E" : "#FFFFFF",
                },
                body: {
                  backgroundColor: theme.colorScheme === "dark" ? "#36393E" : "#FFFFFF",
                },
              }),
            },
            Button: {
              styles: () => ({
                inner: {
                  fontWeight: 700,
                },
              }),
            },
          },
        }}
      >
        {children}
      </MantineProvider>
    </ThemeProvider>
  );
};
