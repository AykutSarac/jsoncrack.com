import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";
import Cookie from "universal-cookie";
import { defaultJson } from "src/constants/data";
import { BottomBar } from "src/containers/Editor/BottomBar";
import { Tools } from "src/containers/Editor/LiveEditor/Tools";
import Panes from "src/containers/Editor/Panes";
import { HerowandModal } from "src/containers/Modals/HerowandModal";
import { Loading } from "src/layout/Loading";
import useFile from "src/store/useFile";
import useJson from "src/store/useJson";
import useUser from "src/store/useUser";

export const StyledPageWrapper = styled.div`
  height: calc(100vh - 27px);
  width: 100%;

  @media only screen and (max-width: 768px) {
    position: fixed;
    height: -webkit-fill-available;
    flex-direction: column;
  }
`;

export const StyledEditorWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const cookie = new Cookie();
const newsCookie = cookie.get("news_seen");

const EditorPage: React.FC = () => {
  const { isReady, query } = useRouter();
  const [showNews, setShowNews] = React.useState(false);
  const checkSession = useUser(state => state.checkSession);
  const loading = useJson(state => state.loading);
  const setContents = useFile(state => state.setContents);
  const fetchFile = useFile(state => state.fetchFile);
  const fetchUrl = useFile(state => state.fetchUrl);

  React.useEffect(() => {
    if (isReady) {
      checkSession();
      if (typeof query?.url === "string") fetchUrl(query.url);
      if (typeof query?.json === "string") fetchFile(query.json);
      if (!query?.url && !query?.json) {
        setContents({ contents: defaultJson, hasChanges: false });
      }
    }

    if (typeof newsCookie === "undefined") {
      setShowNews(true);
    } else setShowNews(false);
  }, [checkSession, fetchFile, fetchUrl, isReady, query.json, query.url, setContents]);

  const closeNews = React.useCallback(() => {
    setShowNews(false);
    cookie.set("news_seen", true, { path: "/", maxAge: 43200 });
  }, []);

  if (loading) return <Loading message="Fetching JSON from cloud..." />;

  return (
    <StyledEditorWrapper>
      <Head>
        <title>Editor | JSON Crack</title>
        <meta name="description" content="View your JSON data in graphs instantly." />
      </Head>
      <StyledPageWrapper>
        <Tools />
        <StyledEditorWrapper>
          <Panes />
        </StyledEditorWrapper>
      </StyledPageWrapper>
      <BottomBar />
      <HerowandModal opened={showNews} onClose={closeNews} />
    </StyledEditorWrapper>
  );
};

export default EditorPage;
