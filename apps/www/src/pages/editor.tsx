import { useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { Tooltip, useMantineColorScheme } from "@mantine/core";
import "@mantine/dropzone/styles.css";
import styled, { ThemeProvider } from "styled-components";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { generateNextSeo } from "next-seo/pages";
import { event as gaEvent } from "nextjs-google-analytics";
import { LuChevronsRight } from "react-icons/lu";
import { SEO } from "../constants/seo";
import { darkTheme, lightTheme } from "../constants/theme";
import { BottomBar } from "../features/editor/BottomBar";
import { FullscreenDropzone } from "../features/editor/FullscreenDropzone";
import { Toolbar } from "../features/editor/Toolbar";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";
import useConfig from "../store/useConfig";
import useFile from "../store/useFile";

const ModalController = dynamic(() => import("../features/modals/ModalController"));
const EditorChoiceModal = dynamic(
  () =>
    import("../features/modals/EditorChoiceModal").then(mod => ({
      default: mod.EditorChoiceModal,
    })),
  { ssr: false }
);
const ExternalMode = dynamic(() => import("../features/editor/ExternalMode"));

export const StyledPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;

  @media only screen and (max-width: 320px) {
    height: 100vh;
  }
`;

export const StyledEditorWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const StyledEditor = styled(Allotment)`
  position: relative !important;
  display: flex;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};

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

const StyledOpenEditorButton = styled.button<{ $dark?: boolean }>`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 120px;
  padding: 0;
  border: none;
  border-radius: 0 8px 8px 0;
  background: ${({ $dark }) => ($dark ? "#e8e8e8" : "#1c1c1e")};
  color: ${({ $dark }) => ($dark ? "#1c1c1e" : "#ffffff")};
  cursor: pointer;
  transition:
    background-color 150ms ease,
    width 150ms ease;

  &:hover {
    width: 32px;
    background: ${({ $dark }) => ($dark ? "#ffffff" : "#333")};
  }
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
  const toggleFullscreen = useGraph(state => state.toggleFullscreen);

  const openEditor = () => {
    toggleFullscreen(false);
    gaEvent("toggle_fullscreen");
  };

  useEffect(() => {
    if (isReady) checkEditorSession(query?.json);
  }, [checkEditorSession, isReady, query]);

  useEffect(() => {
    setColorScheme(darkmodeEnabled ? "dark" : "light");
  }, [darkmodeEnabled, setColorScheme]);

  return (
    <>
      <Head>
        {generateNextSeo({
          ...SEO,
          title: "Editor | JSON Crack",
          description:
            "JSON Crack Editor is a tool for visualizing into graphs, analyzing, editing, formatting, querying, transforming and validating JSON, CSV, YAML, XML, and more.",
          canonical: "https://jsoncrack.com/editor",
        })}
      </Head>
      <ThemeProvider theme={darkmodeEnabled ? darkTheme : lightTheme}>
        <ExternalMode />
        <ModalController />
        <EditorChoiceModal />
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
                    <BottomBar />
                    <TextEditor />
                  </StyledTextEditor>
                </Allotment.Pane>
                <Allotment.Pane minSize={0}>
                  <LiveEditor />
                </Allotment.Pane>
              </StyledEditor>
              {fullscreen && (
                <Tooltip label="Open editor" position="right" withArrow openDelay={750}>
                  <StyledOpenEditorButton
                    $dark={darkmodeEnabled}
                    onClick={openEditor}
                    aria-label="open editor"
                    type="button"
                  >
                    <LuChevronsRight size={16} />
                  </StyledOpenEditorButton>
                </Tooltip>
              )}
              <FullscreenDropzone />
            </StyledEditorWrapper>
          </StyledPageWrapper>
        </StyledEditorWrapper>
      </ThemeProvider>
    </>
  );
};

export default EditorPage;
