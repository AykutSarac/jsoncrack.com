import React from "react";
import styled from "styled-components";
import Editor, { loader, useMonaco } from "@monaco-editor/react";
import { Loading } from "src/layout/Loading";
import useFile from "src/store/useFile";
import useStored from "src/store/useStored";
import { FileFormat } from "src/types/models";

loader.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs",
  },
});
const StyledWrapper = styled.div`
  display: grid;
  height: calc(100vh - 63px);
  grid-template-columns: 100%;
  grid-template-rows: minmax(0, 1fr);
`;

export const MonacoEditor = () => {
  const monaco = useMonaco();
  const contents = useFile(state => state.contents);
  const setContents = useFile(state => state.setContents);
  const setError = useFile(state => state.setError);
  const jsonSchema = useFile(state => state.jsonSchema);
  const getHasChanges = useFile(state => state.getHasChanges);
  const theme = useStored(state => (state.lightmode ? "light" : "vs-dark"));
  const fileType = useFile(state => state.format);
  const editorOptions = React.useMemo(() => {
    return {
      // auto formatting doesn't play well with JSON5 yet
      formatOnPaste: fileType === FileFormat.JSON5 ? false : true,
      formatOnType: fileType === FileFormat.JSON5 ? false : true,
      minimap: {
        enabled: false,
      },
    };
  }, [fileType]);

  React.useEffect(() => {
    monaco?.languages.typescript.javascriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.javascriptDefaults.getCompilerOptions(),
      checkJs: false,
      allowUnusedLabels: true,
    });
    // JSON syntax is a subset of JS, but given that the file has no "exports"
    // it triggers some warning in the Monaco UI. The following setting hides the warning
    monaco?.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
      ...monaco?.languages.json.jsonDefaults.diagnosticsOptions,
      validate: true,
      allowComments: true,
      enableSchemaRequest: true,
      ...(jsonSchema && {
        schemas: [
          {
            fileMatch: ["*"],
            schema: jsonSchema,
          },
        ],
      }),
    });
  }, [
    jsonSchema,
    monaco?.languages.json.jsonDefaults,
    monaco?.languages.typescript.javascriptDefaults,
  ]);

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
        height="100%"
        language={fileType}
        theme={theme}
        value={contents}
        options={editorOptions}
        onValidate={errors => setError(errors[0]?.message)}
        onChange={contents => setContents({ contents, skipUpdate: true })}
        loading={<Loading message="Loading Editor..." />}
      />
    </StyledWrapper>
  );
};
