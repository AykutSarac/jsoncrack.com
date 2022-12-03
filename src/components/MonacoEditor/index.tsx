import React from "react";
import Editor, { loader, Monaco } from "@monaco-editor/react";
import debounce from "lodash.debounce";
import { Loading } from "src/components/Loading";
import useConfig from "src/store/useConfig";
import useGraph from "src/store/useGraph";
import useStored from "src/store/useStored";
import styled from "styled-components";

loader.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs",
  },
});

const editorOptions = {
  formatOnPaste: true,
  minimap: {
    enabled: false,
  },
};

const StyledWrapper = styled.div`
  display: grid;
  height: calc(100vh - 36px);
  grid-template-columns: 100%;
  grid-template-rows: minmax(0, 1fr);
`;

export const MonacoEditor = () => {
  const json = useGraph(state => state.json);
  const setJson = useGraph(state => state.setJson);
  const setConfig = useConfig(state => state.setConfig);
  const [value, setValue] = React.useState<string | undefined>(json);

  const hasError = useConfig(state => state.hasError);
  const lightmode = useStored(state => (state.lightmode ? "light" : "vs-dark"));

  const handleEditorWillMount = React.useCallback(
    (monaco: Monaco) => {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        allowComments: true,
        comments: "ignore",
      });

      monaco.editor.onDidChangeMarkers(([uri]) => {
        const markers = monaco.editor.getModelMarkers({ resource: uri });
        setConfig("hasError", !!markers.length);
      });
    },
    [setConfig]
  );

  const debouncedSetJson = React.useMemo(
    () =>
      debounce(value => {
        if (!value) return;
        setJson(value);
      }, 1200),
    [setJson]
  );

  React.useEffect(() => {
    if (!hasError) debouncedSetJson(value);
  }, [debouncedSetJson, hasError, value]);

  return (
    <StyledWrapper>
      <Editor
        height="100%"
        defaultLanguage="json"
        value={json}
        theme={lightmode}
        options={editorOptions}
        onChange={val => {
          if (json) setConfig("hasChanges", true);
          setValue(val);
        }}
        loading={<Loading message="Loading Editor..." />}
        beforeMount={handleEditorWillMount}
      />
    </StyledWrapper>
  );
};
