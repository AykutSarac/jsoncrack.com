import React, { useEffect, useRef } from "react";
import { Box, Container, Flex, Paper, Text, Title } from "@mantine/core";
import { Editor } from "@monaco-editor/react";
import { NextSeo } from "next-seo";
import { LuCheck, LuXCircle } from "react-icons/lu";
import { SEO } from "src/constants/seo";
import { PageLinks } from "src/containers/ConverterLayout/PageLinks";
import { editorOptions } from "src/containers/ConverterLayout/options";
import { type FileFormat, formats } from "src/enums/file.enum";
import Layout from "src/layout/Layout";
import { contentToJson, jsonToContent } from "src/lib/utils/jsonAdapter";

interface ToolPageProps {
  from: FileFormat;
  to: FileFormat;
}

export const ToolPage = ({ from, to }: ToolPageProps) => {
  const editorRef = useRef<any>(null);
  const [contentHasError, setContentHasError] = React.useState(false);
  const [originalContent, setOriginalContent] = React.useState("");
  const [convertedContent, setConvertedContent] = React.useState("");
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [editorHeight, setEditorHeight] = React.useState(0);

  useEffect(() => {
    if (!originalContent.length) return;

    (async () => {
      try {
        const json = await contentToJson(originalContent, from);
        const content = await jsonToContent(JSON.stringify(json), to);
        setConvertedContent(content);
        setContentHasError(false);
      } catch (_e) {
        setContentHasError(true);
        setConvertedContent("");
      }
    })();
  }, [from, originalContent, to]);

  useEffect(() => {
    const scrollPositionRatio =
      (scrollPosition / editorHeight) * (editorRef.current?.getContentHeight() || 0);

    editorRef.current?.setScrollTop(scrollPositionRatio);
  }, [editorHeight, scrollPosition]);

  return (
    <Layout>
      <NextSeo
        {...SEO}
        title={`${formats.find(({ value }) => value === from)?.label} to ${formats.find(({ value }) => value === to)?.label} | ToDiagram`}
        canonical={`https://todiagram.com/converter/${from}-to-${to}`}
      />
      <Container mt="xl" size="lg">
        <Title c="black">
          {formats.find(({ value }) => value === from)?.label} to{" "}
          {formats.find(({ value }) => value === to)?.label} Converter
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
              onMount={editor => {
                editor.onDidContentSizeChange(() => {
                  setEditorHeight(editor.getContentHeight());
                });

                editor.onDidScrollChange(e => {
                  setScrollPosition(e.scrollTop);
                });
              }}
            />
          </Paper>
          <Paper mah="600px" withBorder flex="1" style={{ overflow: "hidden" }}>
            <Box p="xs" bg="gray">
              <Text c="gray.3">{formats.find(({ value }) => value === to)?.label}</Text>
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
