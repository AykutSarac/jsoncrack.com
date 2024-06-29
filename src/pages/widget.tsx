import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMantineColorScheme } from "@mantine/core";
import { ThemeProvider } from "styled-components";
import toast from "react-hot-toast";
import { CanvasDirection } from "reaflow/dist/layout/elkLayout";
import { darkTheme, lightTheme } from "src/constants/theme";
import { Toolbar } from "src/containers/Toolbar";
import { TreeView } from "src/containers/Views/TreeView";
import { ViewMode } from "src/enums/viewMode.enum";
import useConfig from "src/store/useConfig";
import useGraph from "src/modules/GraphView/stores/useGraph";
import useFile from "src/store/useFile";

type Options = {
  theme: "light" | "dark";
  direction: CanvasDirection;
  viewMode: ViewMode.Graph | ViewMode.Tree;
};
interface EmbedMessage {
  data: {
    json?: string;
    options?: Options;
  };
}

const GraphView = dynamic(() => import("src/modules/GraphView").then(c => c.GraphView), {
  ssr: false,
});

const WidgetPage = () => {
  const { query, push, isReady } = useRouter();
  const { setColorScheme } = useMantineColorScheme();
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");
  const viewMode = useConfig(state => state.viewMode);
  const checkEditorSession = useFile(state => state.checkEditorSession);
  const setContents = useFile(state => state.setContents);
  const setDirection = useGraph(state => state.setDirection);
  const clearGraph = useGraph(state => state.clearGraph);
  const setViewMode = useConfig(state => state.setViewMode);

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

        if (
          event.data?.options?.viewMode === ViewMode.Graph ||
          event.data?.options?.viewMode === ViewMode.Tree
        ) {
          setViewMode(event.data?.options.viewMode);
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
  }, [setColorScheme, setContents, setDirection, setViewMode, theme]);

  React.useEffect(() => {
    setColorScheme(theme);
  }, [setColorScheme, theme]);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
        <Toolbar isWidget />
        {viewMode === ViewMode.Graph && <GraphView isWidget />}
        {viewMode === ViewMode.Tree && <TreeView />}
      </ThemeProvider>
    </>
  );
};

export default WidgetPage;
