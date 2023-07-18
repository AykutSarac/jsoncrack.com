import React from "react";
import { ThemeProvider } from "styled-components";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { monaSans } from "src/constants/customFonts";
import { lightTheme, darkTheme } from "src/constants/theme";
import useStored from "src/store/useStored";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const mantineTheme: MantineThemeOverride = {
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
};

export const EditorWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lightmode = useStored(state => state.lightmode);

  return (
    <ThemeProvider theme={lightmode ? lightTheme : darkTheme}>
      <MantineProvider
        theme={{
          colorScheme: lightmode ? "light" : "dark",
          ...mantineTheme,
        }}
        withCSSVariables
        withGlobalStyles
        withNormalizeCSS
      >
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </MantineProvider>
    </ThemeProvider>
  );
};
