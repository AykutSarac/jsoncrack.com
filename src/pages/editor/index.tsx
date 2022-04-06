import React from "react";
import Head from "next/head";
import { defaultJson } from "src/constants/data";
import dynamic from "next/dynamic";
import { LiveEditor } from "src/containers/LiveEditor";
import { Loading } from "src/components/Loading";
import { Incompatible } from "src/containers/Incompatible";
import * as Styles from "src/pages/editor/styles";

const JsonEditor = dynamic(() => import("src/containers/JsonEditor"), {
  ssr: false,
  loading: () => <Loading message="Loading Editor..." />,
});

const Sidebar = dynamic(() => import("src/components/Sidebar"), {
  ssr: false,
  loading: () => <Loading message="Loading Sidebar..." />,
});

const Editor: React.FC = () => {
  const [json, setJson] = React.useState(JSON.stringify(defaultJson));

  React.useEffect(() => {
    const jsonStored = localStorage.getItem("json");
    if (jsonStored) setJson(jsonStored);
  }, []);

  return (
    <>
      <Head>
        <title>Editor | JSON Visio</title>
      </Head>
      <Styles.StyledPageWrapper>
        <Sidebar setJson={setJson} />
        <Styles.StyledEditorWrapper>
          <Styles.StyledTools></Styles.StyledTools>
          <Styles.StyledEditor
            maxSize={800}
            minSize={300}
            defaultSize={450}
            split="vertical"
          >
            <JsonEditor json={json} setJson={setJson} />
            <LiveEditor json={json} setJson={setJson} />
          </Styles.StyledEditor>
        </Styles.StyledEditorWrapper>
        <Incompatible />
      </Styles.StyledPageWrapper>
    </>
  );
};

export default Editor;
