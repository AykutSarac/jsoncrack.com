import React from "react";
import styled from "styled-components";
import Editor, { loader } from "@monaco-editor/react";
import { Loading } from "src/components/Loading";
import { parser } from "src/utils/jsonParser";
import useConfig from "src/hooks/store/useConfig";
import useStored from "src/hooks/store/useStored";
import useGraph from "src/hooks/store/useGraph";

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

export const MonacoEditor = ({
  setHasError,
}: {
  setHasError: (value: boolean) => void;
}) => {
  const json = useConfig((state) => state.json);
  const expand = useConfig((state) => state.expand);
  const setJson = useConfig((state) => state.setJson);
  const setGraphValue = useGraph((state) => state.setGraphValue);
  const [value, setValue] = React.useState<string | undefined>("");

  const lightmode = useStored((state) =>
    state.lightmode ? "light" : "vs-dark"
  );

  React.useEffect(() => {
    const { nodes, edges } = parser(json, expand);

    setGraphValue("nodes", nodes);
    setGraphValue("edges", edges);
    setValue(json);
  }, [expand, json, setGraphValue]);

  React.useEffect(() => {
    const formatTimer = setTimeout(() => {
      try {
        if (!value) {
          setHasError(false);
          return setJson("{}");
        }

        const parsedJSON = JSON.stringify(JSON.parse(value), null, 2);
        setJson(parsedJSON);
        setHasError(false);
      } catch (jsonError: any) {
        setHasError(true);
      }
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
      />
    </StyledWrapper>
  );
};
