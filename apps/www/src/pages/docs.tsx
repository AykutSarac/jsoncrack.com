import React from "react";
import Head from "next/head";
import {
  Anchor,
  Badge,
  Code,
  Container,
  Divider,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import styled from "styled-components";
import { generateNextSeo } from "next-seo/pages";
import { SEO } from "../constants/seo";
import Layout from "../layout/PageLayout";

const StyledFrame = styled.iframe`
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  width: 100%;
  height: 420px;
`;

const iframeExample = `<iframe
  id="json-crack-embed"
  src="https://jsoncrack.com/widget"
  width="100%"
  height="600"
  style="border: none;"
></iframe>`;

const fetchExample = `<iframe
  id="json-crack-embed"
  src="https://jsoncrack.com/widget?json=https://catfact.ninja/fact"
  width="100%"
  height="600"
  style="border: none;"
></iframe>`;

const postMessageExample = `const iframe = document.getElementById("json-crack-embed");

// Wait for the widget to signal it's ready
window.addEventListener("message", (event) => {
  if (event.data === "json-crack-embed") {
    // Widget is ready — send data
    iframe.contentWindow.postMessage({
      json: JSON.stringify({ hello: "world" }),
      options: {
        theme: "light",
        direction: "DOWN"
      }
    }, "*");
  }
});`;

const reactInstall = "npm install jsoncrack-react";

const Docs = () => {
  return (
    <Layout>
      <Head>
        {generateNextSeo({
          ...SEO,
          title: "Documentation - JSON Crack",
          description:
            "Integrate JSON Crack into your website with iframes, postMessage API, or the React component.",
          canonical: "https://jsoncrack.com/docs",
        })}
      </Head>
      <Container size="md" py={60}>
        <Stack gap={12} mb={48}>
          <Title order={1} c="gray.9" fz={{ base: 28, sm: 36 }}>
            Embed Documentation
          </Title>
          <Text c="gray.6" fz={18} maw={600}>
            Three ways to integrate JSON Crack into your app: iframe widget, postMessage API, or the
            React component.
          </Text>
        </Stack>

        <Stack gap={40}>
          {/* React Component */}
          <Paper bg="white" p={{ base: "md", sm: "xl" }} radius="lg" withBorder>
            <Stack gap="md">
              <Badge variant="light" color="violet" size="lg" radius="sm" w="fit-content">
                React Component
              </Badge>
              <Text c="gray.7" fz={15} lh={1.7}>
                For React applications, use the{" "}
                <Anchor
                  href="https://www.npmjs.com/package/jsoncrack-react"
                  target="_blank"
                  fz={15}
                >
                  jsoncrack-react
                </Anchor>{" "}
                package for a native integration with full control over props and callbacks. See the
                npm page for the full API reference and latest documentation.
              </Text>
              <CodeHighlight
                language="bash"
                code={reactInstall}
                withCopyButton
                styles={{ codeHighlight: { borderRadius: 8 } }}
              />
            </Stack>
          </Paper>

          {/* Method 1: Basic iframe */}
          <Paper bg="white" p={{ base: "md", sm: "xl" }} radius="lg" withBorder>
            <Stack gap="md">
              <Badge variant="light" color="blue" size="lg" radius="sm" w="fit-content">
                1. Iframe Widget
              </Badge>
              <Text c="gray.7" fz={15} lh={1.7}>
                The simplest way to embed JSON Crack. Add an iframe pointing to <Code>/widget</Code>{" "}
                and it will render an interactive graph viewer.
              </Text>
              <CodeHighlight
                language="html"
                code={iframeExample}
                withCopyButton
                styles={{ codeHighlight: { borderRadius: 8 } }}
              />
            </Stack>
          </Paper>

          {/* Method 2: Fetch from URL */}
          <Paper bg="white" p={{ base: "md", sm: "xl" }} radius="lg" withBorder>
            <Stack gap="md">
              <Badge variant="light" color="blue" size="lg" radius="sm" w="fit-content">
                2. Load Data from URL
              </Badge>
              <Text c="gray.7" fz={15} lh={1.7}>
                Pass a <Code>json</Code> query parameter with a URL to automatically fetch and
                display remote data. This works on both the widget and the{" "}
                <Anchor href="/editor?json=https://catfact.ninja/fact" fz={15}>
                  editor
                </Anchor>{" "}
                page.
              </Text>
              <CodeHighlight
                language="html"
                code={fetchExample}
                withCopyButton
                styles={{ codeHighlight: { borderRadius: 8 } }}
              />
              <StyledFrame
                title="Fetch from URL example"
                src="https://codepen.io/AykutSarac/embed/KKBpWVR?default-tab=html%2Cresult"
                loading="eager"
              />
            </Stack>
          </Paper>

          {/* Method 3: postMessage API */}
          <Paper bg="white" p={{ base: "md", sm: "xl" }} radius="lg" withBorder>
            <Stack gap="md">
              <Badge variant="light" color="blue" size="lg" radius="sm" w="fit-content">
                3. postMessage API
              </Badge>
              <Text c="gray.7" fz={15} lh={1.7}>
                For dynamic updates, use the{" "}
                <Anchor
                  href="https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage"
                  target="_blank"
                  fz={15}
                >
                  postMessage API
                </Anchor>{" "}
                to send JSON data and display options to the widget at any time.
              </Text>

              <Paper
                bg="yellow.0"
                p="sm"
                radius="md"
                withBorder
                bd="1px solid var(--mantine-color-yellow-3)"
              >
                <Text c="gray.8" fz={14} lh={1.7}>
                  <Text span fw={600}>
                    Important:
                  </Text>{" "}
                  The iframe must be defined <b>before</b> the script tag. The widget posts its{" "}
                  <Code>id</Code> attribute back to the parent when ready — listen for this message
                  before sending data.
                </Text>
              </Paper>

              <CodeHighlight
                language="javascript"
                code={postMessageExample}
                withCopyButton
                styles={{ codeHighlight: { borderRadius: 8 } }}
              />

              <Title order={4} c="gray.8" mt="xs">
                Message Options
              </Title>
              <Table
                withTableBorder
                withColumnBorders
                styles={{
                  table: { borderRadius: 8, overflow: "hidden" },
                }}
              >
                <Table.Thead bg="gray.0">
                  <Table.Tr>
                    <Table.Th c="gray.7">Property</Table.Th>
                    <Table.Th c="gray.7">Type</Table.Th>
                    <Table.Th c="gray.7">Description</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>
                      <Code>json</Code>
                    </Table.Td>
                    <Table.Td>
                      <Code>string</Code>
                    </Table.Td>
                    <Table.Td>Stringified JSON data to visualize</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <Code>options.theme</Code>
                    </Table.Td>
                    <Table.Td>
                      <Code>&quot;light&quot; | &quot;dark&quot;</Code>
                    </Table.Td>
                    <Table.Td>Color theme for the graph</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <Code>options.direction</Code>
                    </Table.Td>
                    <Table.Td>
                      <Code>
                        &quot;RIGHT&quot; | &quot;DOWN&quot; | &quot;LEFT&quot; | &quot;UP&quot;
                      </Code>
                    </Table.Td>
                    <Table.Td>
                      Layout direction of the graph (default: <Code>RIGHT</Code>)
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              <StyledFrame
                title="Post message example"
                src="https://codepen.io/AykutSarac/embed/rNrVyWP?default-tab=html%2Cresult"
                loading="lazy"
              />

              <Divider my="xs" />

              <Title order={4} c="gray.8">
                Sending Data on Page Load
              </Title>
              <StyledFrame
                title="On page load example"
                src="https://codepen.io/AykutSarac/embed/QWBbpqx?default-tab=html%2Cresult"
                loading="lazy"
              />
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Docs;
