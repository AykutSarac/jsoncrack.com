import React from "react";
import Editor, { loader, Monaco } from "@monaco-editor/react";
import { parse } from "jsonc-parser";
import { Loading } from "src/components/Loading";
import useConfig from "src/hooks/store/useConfig";
import useGraph from "src/hooks/store/useGraph";
import useStored from "src/hooks/store/useStored";
import { parser } from "src/utils/jsonParser";
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

function handleEditorWillMount(monaco: Monaco) {
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    allowComments: true,
    comments: "ignore",
  });
}

export const MonacoEditor = ({
  setHasError,
}: {
  setHasError: (value: boolean) => void;
}) => {
  const json = useConfig(state => state.json);
  const expand = useConfig(state => state.expand);
  const setJson = useConfig(state => state.setJson);
  const setGraphValue = useGraph(state => state.setGraphValue);
  const lightmode = useStored(state => (state.lightmode ? "light" : "vs-dark"));
  const [value, setValue] = React.useState<string | undefined>("");

  React.useEffect(() => {
    const { nodes, edges } = parser(json, expand);

    setGraphValue("loading", true);
    setGraphValue("nodes", nodes);
    setGraphValue("edges", edges);
    setValue(json);
  }, [expand, json, setGraphValue]);

  React.useEffect(() => {
    const formatTimer = setTimeout(() => {
      if (!value) {
        setHasError(false);
        return setJson("{}");
      }

      const errors = [];
      const parsedJSON = JSON.stringify(parse(value, errors), null, 2);
      if (errors.length) return setHasError(true);

      setJson(parsedJSON);
      setHasError(false);
    }, 1200);

    return () => clearTimeout(formatTimer);
  }, [value, setJson, setHasError]);

  return (
    <StyledWrapper>
      <Editor
        height="100%"
        defaultLanguage="json"
        value={value}
        theme={lightmode}
        options={editorOptions}
        onChange={setValue}
        loading={<Loading message="Loading Editor..." />}
        beforeMount={handleEditorWillMount}
      />
    </StyledWrapper>
  );
};
