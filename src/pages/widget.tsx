import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useMantineColorScheme } from "@mantine/core";
import { ThemeProvider } from "styled-components";
import { NextSeo } from "next-seo";
import toast from "react-hot-toast";
import { darkTheme, lightTheme } from "../constants/theme";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";
import useFile from "../store/useFile";
import type { LayoutDirection } from "../types/graph";

interface EmbedMessage {
  data: {
    json?: string;
    options?: {
      theme?: "light" | "dark";
      direction?: LayoutDirection;
    };
  };
}

const ModalController = dynamic(() => import("../features/modals/ModalController"), {
  ssr: false,
});

const GraphView = dynamic(
  () => import("../features/editor/views/GraphView").then(c => c.GraphView),
  {
    ssr: false,
  }
);

const WidgetPage = () => {
  const { query, push, isReady } = useRouter();
  const { setColorScheme } = useMantineColorScheme();
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");
  const checkEditorSession = useFile(state => state.checkEditorSession);
  const setContents = useFile(state => state.setContents);
  const setDirection = useGraph(state => state.setDirection);
  const clearGraph = useGraph(state => state.clearGraph);

  React.useEffect(() => {
    if (isReady) {
      if (typeof query?.json === "string") checkEditorSession(query.json, true);
      else clearGraph();

      window.parent.postMessage(window.frameElement?.getAttribute("id"), "*");
    }
  }, [clearGraph, checkEditorSession, isReady, push, query.json, query.partner]);

  React.useEffect(() => {
    const handler = (event: EmbedMessage) => {
      try {
        if (!event.data?.json) return;
        if (event.data?.options?.theme === "light" || event.data?.options?.theme === "dark") {
          setTheme(event.data.options.theme);
        }

        setContents({ contents: event.data.json, hasChanges: false });
        setDirection(event.data.options?.direction || "RIGHT");
      } catch (error) {
        console.error(error);
        toast.error("Invalid JSON!");
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [setColorScheme, setContents, setDirection, theme]);

  React.useEffect(() => {
    setColorScheme(theme);
  }, [setColorScheme, theme]);

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <NextSeo noindex nofollow />
      <ModalController />
      <GraphView isWidget />
    </ThemeProvider>
  );
};

export default WidgetPage;
