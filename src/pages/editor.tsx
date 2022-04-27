import React from "react";
import Head from "next/head";
import styled from "styled-components";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("src/containers/Editor"), { ssr: false });

const StyledEditorWrapper = styled.div`
  *::-webkit-scrollbar {
    width: 8px;
    background: ${({ theme }) => theme.BLACK_SECONDARY};
  }

  *::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: ${({ theme }) => theme.SILVER_DARK};
  }
`;

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
