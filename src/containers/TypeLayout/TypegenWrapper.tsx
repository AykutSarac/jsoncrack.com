import React, { useEffect, useRef } from "react";
import { Box, Container, Flex, Paper, Title, Text } from "@mantine/core";
import { Editor } from "@monaco-editor/react";
import { NextSeo } from "next-seo";
import { LuCheck, LuXCircle } from "react-icons/lu";
import { SEO } from "src/constants/seo";
import { editorOptions } from "src/containers/ConverterLayout/options";
import { type FileFormat, formats, type TypeLanguage, typeOptions } from "src/enums/file.enum";
import Layout from "src/layout/Layout";
import { generateType } from "src/lib/utils/generateType";
import { PageLinks } from "./PageLinks";

interface ConverterPagesProps {
  from: FileFormat;
  to: TypeLanguage;
}

export const TypegenWrapper = ({ from, to }: ConverterPagesProps) => {
  const editorRef = useRef<any>(null);
  const [contentHasError, setContentHasError] = React.useState(false);
  const [originalContent, setOriginalContent] = React.useState("");
  const [convertedContent, setConvertedContent] = React.useState("");

  useEffect(() => {
    if (!originalContent.length) return;

    (async () => {
      try {
        const type = await generateType(originalContent, from, to);
        setConvertedContent(type);
        setContentHasError(false);
      } catch (_e) {
        setContentHasError(true);
        setConvertedContent("");
      }
    })();
  }, [from, originalContent, to]);

  return (
    <Layout>
      <NextSeo
        {...SEO}
        title={`${formats.find(({ value }) => value === from)?.label} to ${typeOptions.find(({ value }) => value === to)?.label} | ToDiagram`}
        canonical={`https://todiagram.com/converter/${from}-to-${to}`}
      />
      <Container mt="xl" size="lg">
        <Title c="black">
          {formats.find(({ value }) => value === from)?.label} to{" "}
          {typeOptions.find(({ value }) => value === to)?.label} Converter
        </Title>
        <PageLinks />
        <Flex pt="lg" gap="40">
          <Paper mah="600px" withBorder flex="1" style={{ overflow: "hidden" }}>
            <Box p="xs" bg="gray">
              <Flex justify="space-between" align="center">
                <Text c="gray.3">{formats.find(({ value }) => value === from)?.label}</Text>
                {contentHasError && !!originalContent ? (
                  <LuXCircle color="red" />
                ) : (
                  <LuCheck color="lightgreen" />
                )}
              </Flex>
            </Box>
            <Editor
              value={originalContent}
              onChange={value => setOriginalContent(value || "")}
              language={from}
              height={500}
              options={editorOptions}
            />
          </Paper>
          <Paper mah="600px" withBorder flex="1" style={{ overflow: "hidden" }}>
            <Box p="xs" bg="gray">
              <Text c="gray.3">{typeOptions.find(({ value }) => value === to)?.label}</Text>
            </Box>
            <Editor
              value={convertedContent}
              language={to}
              height={500}
              options={{
                ...editorOptions,
                readOnly: true,
              }}
              onMount={editor => {
                editorRef.current = editor;
              }}
            />
          </Paper>
        </Flex>
      </Container>
    </Layout>
  );
};
