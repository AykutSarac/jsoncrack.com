import React from "react";
import styled from "styled-components";
import Editor from "@monaco-editor/react";
import parseJson from "parse-json";
import { loader } from "@monaco-editor/react";
import { ErrorContainer } from "src/components/ErrorContainer/ErrorContainer";
import useConfig from "src/hooks/store/useConfig";
import { Loading } from "src/components/Loading";
import useStored from "src/hooks/store/useStored";

loader.config({
  paths: {
    vs: "https://microsoft.github.io/monaco-editor/node_modules/monaco-editor/min/vs",
  },
});

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  user-select: none;
`;

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

export const JsonEditor: React.FC = () => {
  const [value, setValue] = React.useState<string | undefined>("");
  const [error, setError] = React.useState("");

  const json = useConfig((state) => state.json);
  const lightmode = useStored((state) => state.lightmode);
  const setJson = useConfig((state) => state.setJson);

  const editorTheme = React.useMemo(
    () => (lightmode ? "light" : "vs-dark"),
    [lightmode]
  );

  React.useEffect(() => {
    setValue(JSON.stringify(JSON.parse(json), null, 2));
  }, [json]);

  React.useEffect(() => {
    const formatTimer = setTimeout(() => {
      try {
        if (!value) {
          setError("");
          return setJson("{}");
        }

        parseJson(value);
        setJson(value);
        setError("");
      } catch (jsonError: any) {
        setError(jsonError.message);
      }
    }, 1500);

    return () => clearTimeout(formatTimer);
  }, [value, setJson]);

  return (
    <StyledEditorWrapper>
      <ErrorContainer error={error} />
      <StyledWrapper>
        <Editor
          height="100%"
          defaultLanguage="json"
          value={value}
          theme={editorTheme}
          options={editorOptions}
          onChange={setValue}
          loading={<Loading message="Loading Editor..." />}
        />
      </StyledWrapper>
    </StyledEditorWrapper>
  );
};
