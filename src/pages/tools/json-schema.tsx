import React from "react";
import { Box, Button, Container, Flex, Paper, Title, Text } from "@mantine/core";
import { Editor, type OnMount } from "@monaco-editor/react";
import { JSONSchemaFaker } from "json-schema-faker";
import { NextSeo } from "next-seo";
import { LuCheck, LuXCircle } from "react-icons/lu";
import { SEO } from "src/constants/seo";
import { FileFormat, TypeLanguage } from "src/enums/file.enum";
import { editorOptions } from "src/layout/ConverterLayout/options";
import Layout from "src/layout/PageLayout";
import { generateType } from "src/lib/utils/generateType";
import { jsonToContent } from "src/lib/utils/jsonAdapter";

const JSONSchemaTool = () => {
  const monacoRef = React.useRef<Parameters<OnMount>[1] | null>(null);
  const [jsonError, setJsonError] = React.useState(false);
  const [jsonSchemaError, setJsonSchemaError] = React.useState(false);
  const [json, setJson] = React.useState("");
  const [jsonSchema, setJsonSchema] = React.useState("");

  React.useEffect(() => {
    monacoRef.current?.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: true,
      enableSchemaRequest: true,
      ...(jsonSchema && {
        schemas: [
          {
            uri: "",
            fileMatch: ["*"],
            schema: jsonSchema,
          },
        ],
      }),
    });
  }, [jsonSchema]);

  const generateJsonSchema = async () => {
    const jsonSchema = await generateType(json, FileFormat.JSON, TypeLanguage.JSON_SCHEMA);
    setJsonSchema(jsonSchema);
  };

  const generateJson = async () => {
    const randomJson = await JSONSchemaFaker.resolve(JSON.parse(jsonSchema));
    const contents = await jsonToContent(JSON.stringify(randomJson, null, 2), FileFormat.JSON);
    setJson(contents);
  };

  return (
    <Layout>
      <NextSeo
        {...SEO}
        title="JSON Schema Validator & Generator"
        description="Use our JSON Schema Validator & Generator tool to easily validate and generate JSON schemas, and generate data from JSON schemas. Simply input your JSON data, generate the corresponding schema, and validate your data with ease."
        canonical="https://jsoncrack.com/tools/json-schema"
      />
      <Container mt="xl" size="xl">
        <Title c="black">JSON Schema Validator & Generator</Title>
        <Flex pt="lg" gap="lg">
          <Button
            onClick={generateJsonSchema}
            variant="default"
            size="md"
            disabled={!json.length || jsonError}
          >
            Generate JSON Schema
          </Button>
          <Button
            onClick={generateJson}
            variant="default"
            size="md"
            disabled={!jsonSchema.length || jsonSchemaError}
          >
            Generate JSON
          </Button>
        </Flex>
        <Flex pt="lg" gap="40">
          <Paper mah="600px" withBorder flex="1" style={{ overflow: "hidden" }}>
            <Box p="xs" bg="gray">
              <Flex justify="space-between" align="center">
                <Text c="gray.3">JSON</Text>
                {jsonError ? <LuXCircle color="red" /> : <LuCheck color="lightgreen" />}
              </Flex>
            </Box>
            <Editor
              value={json}
              onChange={value => setJson(value || "")}
              onValidate={errors => setJsonError(!!errors.length)}
              language="json"
              height={500}
              options={editorOptions}
              onMount={(_editor, monaco) => (monacoRef.current = monaco)}
            />
          </Paper>
          <Paper mah="600px" withBorder flex="1" style={{ overflow: "hidden" }}>
            <Box p="xs" bg="gray">
              <Flex justify="space-between" align="center">
                <Text c="gray.3">JSON Schema</Text>
                {jsonSchemaError ? <LuXCircle color="red" /> : <LuCheck color="lightgreen" />}
              </Flex>
            </Box>
            <Editor
              value={jsonSchema}
              onChange={value => setJsonSchema(value || "")}
              onValidate={errors => setJsonSchemaError(!!errors.length)}
              language="json"
              height={500}
              options={editorOptions}
            />
          </Paper>
        </Flex>
      </Container>
    </Layout>
  );
};

export default JSONSchemaTool;
