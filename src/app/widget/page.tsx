"use client";

import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import { MantineProvider } from "@mantine/core";
import { ThemeProvider } from "styled-components";
import toast from "react-hot-toast";
import { darkTheme, lightTheme } from "src/constants/theme";
import { Toolbar } from "src/containers/Toolbar";
import useFile from "src/store/useFile";
import useGraph from "src/store/useGraph";

interface EmbedMessage {
  data: {
    json?: string;
    options?: any;
  };
}

const Graph = dynamic(() => import("src/containers/Views/GraphView").then(c => c.Graph), {
  ssr: false,
});

const WidgetPage = () => {
  const { push } = useRouter();
  const queryParams = useSearchParams();
  const jsonParam = queryParams?.get("json");
  const partnerParam = queryParams?.get("partner");
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");
  const checkEditorSession = useFile(state => state.checkEditorSession);
  const setContents = useFile(state => state.setContents);
  const setDirection = useGraph(state => state.setDirection);
  const clearGraph = useGraph(state => state.clearGraph);

  React.useEffect(() => {
    if (typeof jsonParam === "string") checkEditorSession(jsonParam, true);
    else clearGraph();
    window.parent.postMessage(window.frameElement?.getAttribute("id"), "*");
  }, [clearGraph, checkEditorSession, push, jsonParam, partnerParam]);

  React.useEffect(() => {
    const handler = (event: EmbedMessage) => {
      try {
        if (!event.data?.json) return;
        if (event.data?.options?.theme === "light" || event.data?.options?.theme === "dark") {
          setTheme(event.data.options.theme);
        }

        setContents({ contents: event.data.json, hasChanges: false });
        setDirection(event.data.options?.direction);
      } catch (error) {
        console.error(error);
        toast.error("Invalid JSON!");
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [setContents, setDirection, theme]);

  return (
    <MantineProvider forceColorScheme={theme}>
      <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
        <Head>
          <meta name="robots" content="noindex,nofollow" />
        </Head>
        <Toolbar isWidget />
        <Graph isWidget />
      </ThemeProvider>
    </MantineProvider>
  );
};

export default WidgetPage;
