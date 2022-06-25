import React from "react";
import Head from "next/head";
import Editor from "src/containers/Editor";
import styled from "styled-components";

const StyledEditorWrapper = styled.div``;

const EditorPage: React.FC = () => {
  return (
    <StyledEditorWrapper>
      <Head>
        <title>Editor | JSON Visio</title>
        <meta
          name="description"
          content="View your JSON data in graphs instantly."
        />
      </Head>
      <Editor />
    </StyledEditorWrapper>
  );
};

export default EditorPage;
