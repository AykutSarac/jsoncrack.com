import React from "react";
import Head from "next/head";
import { Editor } from "src/containers/Editor";
import { WithConfig } from "src/hocs/config";

const EditorPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Editor | JSON Visio</title>
        <meta
          name="description"
          content="View your JSON data in graphs instantly."
        />
      </Head>
      <WithConfig>
        <Editor />
      </WithConfig>
    </>
  );
};

export default EditorPage;
