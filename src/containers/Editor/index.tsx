import React from "react";
import dynamic from "next/dynamic";
import { Sidebar } from "src/components/Sidebar";
import { LiveEditor } from "src/containers/LiveEditor";
import { Loading } from "src/components/Loading";
import { Incompatible } from "src/containers/Incompatible";
import * as Styles from "src/containers/Editor/styles";
import { useConfig } from "src/hocs/config";
import { Allotment } from "allotment";

const JsonEditor = dynamic(() => import("src/containers/JsonEditor"), {
  loading: () => <Loading message="Loading Editor..." />,
});

const Editor: React.FC = () => {
  const {
    states: { settings },
  } = useConfig();

  return (
    <Styles.StyledPageWrapper>
      <Sidebar />
      <Styles.StyledEditorWrapper>
        <Styles.StyledEditor>
          <Allotment.Pane
            preferredSize={450}
            minSize={300}
            maxSize={600}
            visible={!settings.hideEditor}
          >
            <JsonEditor />
          </Allotment.Pane>
          <Allotment.Pane>
            <LiveEditor />
          </Allotment.Pane>
        </Styles.StyledEditor>
      </Styles.StyledEditorWrapper>
      <Incompatible />
    </Styles.StyledPageWrapper>
  );
};

export default Editor;
