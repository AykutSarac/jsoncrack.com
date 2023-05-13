import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ThemeProvider } from "styled-components";
import toast from "react-hot-toast";
import { darkTheme, lightTheme } from "src/constants/theme";
import { Tools } from "src/containers/Editor/LiveEditor/Tools";
import useFile from "src/store/useFile";
import useGraph from "src/store/useGraph";

interface EmbedMessage {
  data: {
    json?: string;
    options?: any;
  };
}

const Graph = dynamic(() => import("src/components/Graph").then(c => c.Graph), {
  ssr: false,
});

const WidgetPage = () => {
  const { query, push, isReady } = useRouter();
  const [theme, setTheme] = React.useState("dark");
  const fetchFile = useFile(state => state.fetchFile);
  const setGraph = useGraph(state => state.setGraph);
  const clearGraph = useGraph(state => state.clearGraph);

  React.useEffect(() => {
    if (isReady) {
      if (typeof query?.json === "string") fetchFile(query.json);
      else clearGraph();
      window.parent.postMessage(window.frameElement?.getAttribute("id"), "*");
    }
  }, [clearGraph, fetchFile, isReady, push, query.json, query.partner]);

  React.useEffect(() => {
    const handler = (event: EmbedMessage) => {
      try {
        if (!event.data?.json) return;
        if (event.data?.options?.theme === "light" || event.data?.options?.theme === "dark") {
          setTheme(event.data.options.theme);
        }

        setGraph(event.data.json, event.data.options);
      } catch (error) {
        console.error(error);
        toast.error("Invalid JSON!");
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [setGraph, theme]);

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <Tools isWidget />
      <Graph isWidget />
    </ThemeProvider>
  );
};

export default WidgetPage;
