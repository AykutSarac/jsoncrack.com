import React, { useEffect, useRef } from "react";
import { Box, Container, Flex, Paper, Text, Title } from "@mantine/core";
import { Editor } from "@monaco-editor/react";
import { NextSeo } from "next-seo";
import { LuCheck, LuCircleX } from "react-icons/lu";
import { SEO } from "src/constants/seo";
import { type FileFormat, formats } from "src/enums/file.enum";
import { PageLinks } from "src/layout/ConverterLayout/PageLinks";
import { editorOptions } from "src/layout/ConverterLayout/options";
import Layout from "src/layout/PageLayout";
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

  const fromLabel = formats.find(({ value }) => value === from)?.label;
  const toLabel = formats.find(({ value }) => value === to)?.label;

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
        title={`${fromLabel} to ${toLabel} | JSON Crack`}
        canonical={`https://jsoncrack.com/converter/${from}-to-${to}`}
        description={`Convert ${fromLabel} to ${toLabel} using this free online tool. Upload your ${fromLabel} file and get the converted ${fromLabel} file instantly.`}
      />
      <Container mt="xl" size="lg">
        <Title c="black">
          {fromLabel} to {toLabel} Converter
        </Title>
        <PageLinks />
        <Flex pt="lg" gap="40">
          <Paper mah="600px" withBorder flex="1" style={{ overflow: "hidden" }}>
            <Box p="xs" bg="gray">
              <Flex justify="space-between" align="center">
                <Text c="gray.3">{fromLabel}</Text>
                {contentHasError && !!originalContent ? (
                  <LuCircleX color="red" />
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
              <Text c="gray.3">{toLabel}</Text>
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
