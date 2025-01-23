import React, { useEffect, useRef } from "react";
import { Box, Container, Flex, Paper, Title, Text } from "@mantine/core";
import { Editor } from "@monaco-editor/react";
import { NextSeo } from "next-seo";
import { LuCheck, LuCircleX } from "react-icons/lu";
import { SEO } from "src/constants/seo";
import { type FileFormat, formats, type TypeLanguage, typeOptions } from "src/enums/file.enum";
import { editorOptions } from "src/layout/ConverterLayout/options";
import Layout from "src/layout/PageLayout";
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

  const fromLabel = formats.find(({ value }) => value === from)?.label;
  const toLabel = typeOptions.find(({ value }) => value === to)?.label;

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
        title={`${fromLabel} to ${toLabel} | JSON Crack`}
        canonical={`https://jsoncrack.com/converter/${from}-to-${to}`}
        description={`Instantly generate ${toLabel} from ${fromLabel} using this free online tool. Paste your ${fromLabel} and get the generated ${toLabel} instantly.`}
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
