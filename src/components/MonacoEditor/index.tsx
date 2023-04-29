import React from "react";
import styled from "styled-components";
import Editor, { loader, Monaco } from "@monaco-editor/react";
import debounce from "lodash.debounce";
import { Loading } from "src/layout/Loading";
import useJson from "src/store/useJson";
import useStored from "src/store/useStored";

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
  const json = useJson(state => state.json);
  const setJson = useJson(state => state.setJson);
  const setError = useJson(state => state.setError);
  const [loaded, setLoaded] = React.useState(false);
  const [value, setValue] = React.useState<string | undefined>(json);

  const hasError = useJson(state => state.hasError);
  const getHasChanges = useJson(state => state.getHasChanges);
  const lightmode = useStored(state => (state.lightmode ? "light" : "vs-dark"));

  const handleEditorWillMount = React.useCallback(
    (monaco: Monaco) => {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        allowComments: true,
        comments: "ignore",
      });

      monaco.editor.onDidChangeMarkers(([uri]) => {
        const markers = monaco.editor.getModelMarkers({ resource: uri });
        setError(!!markers.length);
      });
    },
    [setError]
  );

  const debouncedSetJson = React.useMemo(
    () =>
      debounce(value => {
        if (hasError) return;
        setJson(value || "[]");
      }, 1200),
    [hasError, setJson]
  );

  React.useEffect(() => {
    if ((value || !hasError) && loaded) debouncedSetJson(value);
    setLoaded(true);

    return () => debouncedSetJson.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSetJson, hasError, value]);

  const handleChange = React.useCallback((value?: string) => {
    try {
      const parsedJson = JSON.stringify(JSON.parse(value!), null, 2);
      setValue(parsedJson);
    } catch (error) {
      setValue(value);
    }
  }, []);

  React.useEffect(() => {
    const beforeunload = (e: BeforeUnloadEvent) => {
      if (getHasChanges()) {
        const confirmationMessage =
          "Unsaved changes, if you leave before saving  your changes will be lost";

        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage;
      }
    };

    window.addEventListener("beforeunload", beforeunload);

    return () => {
      window.removeEventListener("beforeunload", beforeunload);
    };
  }, [getHasChanges]);

  return (
    <StyledWrapper>
      <Editor
        value={json}
        theme={lightmode}
        options={editorOptions}
        onChange={handleChange}
        loading={<Loading message="Loading Editor..." />}
        beforeMount={handleEditorWillMount}
        defaultLanguage="json"
        height="100%"
      />
    </StyledWrapper>
  );
};
