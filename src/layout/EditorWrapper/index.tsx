import React from "react";
import { ThemeProvider } from "styled-components";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { monaSans } from "src/constants/fonts";
import { lightTheme, darkTheme } from "src/constants/theme";
import useConfig from "src/store/useConfig";

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
          backgroundColor: theme.colorScheme === "dark" ? "#4a4d52" : "#F3F3F3",
        },
        body: {
          backgroundColor: theme.colorScheme === "dark" ? "#4a4d52" : "#F3F3F3",
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
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);

  return (
    <ThemeProvider theme={darkmodeEnabled ? darkTheme : lightTheme}>
      <MantineProvider
        theme={{
          colorScheme: darkmodeEnabled ? "dark" : "light",
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
