import { Allotment } from "allotment";
import React from "react";
import { JsonEditor } from "src/containers/Editor/JsonEditor";
import { StyledEditor } from "./styles";
import dynamic from "next/dynamic";
import useConfig from "src/hooks/store/useConfig";

const LiveEditor = dynamic(() => import("src/containers/Editor/LiveEditor"), {
  ssr: false,
});

const Panes: React.FC = () => {
  const hideEditor = useConfig((state) => state.settings.hideEditor);

  return (
    <StyledEditor>
      <Allotment.Pane
        preferredSize={400}
        minSize={300}
        maxSize={600}
        visible={!hideEditor}
      >
        <JsonEditor />
      </Allotment.Pane>
      <Allotment.Pane>
        <LiveEditor />
      </Allotment.Pane>
    </StyledEditor>
  );
};

export default Panes;
