"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import { ThemeProvider } from "styled-components";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import ReactGA from "react-ga4";
import GlobalStyle from "src/constants/globalStyle";
import { lightTheme } from "src/constants/theme";
import { supabase } from "src/lib/api/supabase";
import useUser from "src/store/useUser";

const isDevelopment = process.env.NODE_ENV === "development";
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

ReactGA.initialize(GA_TRACKING_ID, { testMode: isDevelopment });

const mantineTheme = createTheme({
  primaryShade: 8,
});

const Toaster = dynamic(() => import("react-hot-toast").then(c => c.Toaster));
const ExternalMode = dynamic(() => import("src/layout/ExternalMode"));
const ModalController = dynamic(() => import("src/layout/ModalController"));

export default function CustomAppInit({ children }: { children: React.ReactNode }): JSX.Element {
  const pathname = usePathname();
  const setSession = useUser(state => state.setSession);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSession(session);
    });
  }, [setSession]);

  const handleRouteChange = (page: string) => {
    ReactGA.send({ hitType: "pageview", page });
  };

  React.useEffect(() => {
    handleRouteChange(pathname || "");
  }, [pathname]);

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <MantineProvider theme={mantineTheme}>
        <ThemeProvider theme={lightTheme}>
          <GlobalStyle />
          {children}
          <ModalController />
          <Toaster
            position="top-right"
            containerStyle={{
              top: 40,
              right: 6,
              fontSize: 14,
            }}
            toastOptions={{
              style: {
                background: "#4D4D4D",
                color: "#B9BBBE",
                borderRadius: 4,
              },
            }}
          />
          <ExternalMode />
        </ThemeProvider>
      </MantineProvider>
    </SessionContextProvider>
  );
}
