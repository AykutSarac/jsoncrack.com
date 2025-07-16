import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useMantineColorScheme } from "@mantine/core";
import "@mantine/dropzone/styles.css";
import styled, { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
// import Cookie from "js-cookie";
import { NextSeo } from "next-seo";
import { SEO } from "../constants/seo";
import { darkTheme, lightTheme } from "../constants/theme";
import { BottomBar } from "../features/editor/BottomBar";
import { FullscreenDropzone } from "../features/editor/FullscreenDropzone";
import { Toolbar } from "../features/editor/Toolbar";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";
import useConfig from "../store/useConfig";
import useFile from "../store/useFile";

const ModalController = dynamic(() => import("../features/modals/ModalController"));
const ExternalMode = dynamic(() => import("../features/editor/ExternalMode"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const StyledPageWrapper = styled.div`
  height: 100vh;
  width: 100%;

  @media only screen and (max-width: 320px) {
    height: 100vh;
  }
`;

export const StyledEditorWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const StyledEditor = styled(Allotment)`
  position: relative !important;
  display: flex;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  height: calc(100vh - 40px);

  @media only screen and (max-width: 320px) {
    height: 100vh;
  }
`;

const StyledTextEditor = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const TextEditor = dynamic(() => import("../features/editor/TextEditor"), {
  ssr: false,
});

const LiveEditor = dynamic(() => import("../features/editor/LiveEditor"), {
  ssr: false,
});

const EditorPage = () => {
  const { query, isReady } = useRouter();
  const { setColorScheme } = useMantineColorScheme();
  const checkEditorSession = useFile(state => state.checkEditorSession);
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);
  const fullscreen = useGraph(state => state.fullscreen);

  useEffect(() => {
    if (isReady) checkEditorSession(query?.json);
  }, [checkEditorSession, isReady, query]);

  useEffect(() => {
    setColorScheme(darkmodeEnabled ? "dark" : "light");
  }, [darkmodeEnabled, setColorScheme]);

  return (
    <>
      <NextSeo
        {...SEO}
        title="Editor | JSON Crack"
        description="JSON Crack Editor is a tool for visualizing into graphs, analyzing, editing, formatting, querying, transforming and validating JSON, CSV, YAML, XML, and more."
        canonical="https://jsoncrack.com/editor"
      />
      <ThemeProvider theme={darkmodeEnabled ? darkTheme : lightTheme}>
        <QueryClientProvider client={queryClient}>
          <ExternalMode />
          <ModalController />
          <StyledEditorWrapper>
            <StyledPageWrapper>
              <Toolbar />
              <StyledEditorWrapper>
                <StyledEditor proportionalLayout={false}>
                  <Allotment.Pane
                    preferredSize={450}
                    minSize={fullscreen ? 0 : 300}
                    maxSize={800}
                    visible={!fullscreen}
                  >
                    <StyledTextEditor>
                      <TextEditor />
                      <BottomBar />
                    </StyledTextEditor>
                  </Allotment.Pane>
                  <Allotment.Pane minSize={0}>
                    <LiveEditor />
                  </Allotment.Pane>
                </StyledEditor>
                <FullscreenDropzone />
              </StyledEditorWrapper>
            </StyledPageWrapper>
          </StyledEditorWrapper>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
};

export default EditorPage;
