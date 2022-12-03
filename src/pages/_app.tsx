import React from "react";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { init } from "@sentry/nextjs";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from "src/components/GoogleAnalytics";
import GlobalStyle from "src/constants/globalStyle";
import { darkTheme, lightTheme } from "src/constants/theme";
import { ModalController } from "src/containers/ModalController";
import useStored from "src/store/useStored";
import useUser from "src/store/useUser";
import { ThemeProvider } from "styled-components";

if (process.env.NODE_ENV !== "development") {
  init({
    dsn: "https://d3345591295d4dd1b8c579b62003d939@o1284435.ingest.sentry.io/6495191",
    tracesSampleRate: 0.5,
  });
}

function JsonCrack({ Component, pageProps }: AppProps) {
  const lightmode = useStored(state => state.lightmode);
  const [isRendered, setRendered] = React.useState(false);
  const checkSession = useUser(state => state.checkSession);

  React.useEffect(() => {
    setRendered(true);
  }, []);

  if (isRendered)
    return (
      <GoogleOAuthProvider
        onScriptLoadSuccess={() => checkSession()}
        clientId="34440253867-g7s6qhtaqe7lumj1vutctm49t8dhvcf9.apps.googleusercontent.com"
      >
        <GoogleAnalytics />
        <ThemeProvider theme={lightmode ? lightTheme : darkTheme}>
          <GlobalStyle />
          <Component {...pageProps} />
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
              },
            }}
          />
          <ModalController />
        </ThemeProvider>
      </GoogleOAuthProvider>
    );
}

export default JsonCrack;
