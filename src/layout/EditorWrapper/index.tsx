import React from "react";
import dynamic from "next/dynamic";
import { MantineProvider } from "@mantine/core";
import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lightTheme, darkTheme } from "src/constants/theme";
import useConfig from "src/store/useConfig";

const ModalController = dynamic(() => import("src/layout/ModalController"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const EditorWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);

  return (
    <ThemeProvider theme={darkmodeEnabled ? darkTheme : lightTheme}>
      <MantineProvider forceColorScheme={darkmodeEnabled ? "dark" : "light"}>
        <QueryClientProvider client={queryClient}>
          <ModalController />
          {children}
        </QueryClientProvider>
      </MantineProvider>
    </ThemeProvider>
  );
};
