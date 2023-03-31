import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import styled from "styled-components";
import { Button } from "@mantine/core";
import materialDark from "react-syntax-highlighter/dist/cjs/styles/prism/material-dark";
import { Footer } from "src/components/Footer";

const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter/dist/cjs/prism-async"), {
  ssr: false,
});

const StyledFrame = styled.iframe`
  border: none;
  width: 80%;
  flex: 500px;
  margin: 3% auto;
`;

const StyledPage = styled.div`
  padding: 5%;
`;

const StyledContent = styled.section`
  margin-top: 20px;
  background: rgba(181, 116, 214, 0.23);
  padding: 16px;
  border-radius: 6px;
`;

const StyledDescription = styled.div``;

const StyledContentBody = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 15px;
  line-height: 1.8;

  ${StyledDescription} {
    flex: 1;
  }
`;

const StyledHighlight = styled.span<{ link?: boolean; alert?: boolean }>`
  text-align: left;
  white-space: nowrap;
  color: ${({ theme, link, alert }) =>
    alert ? theme.DANGER : link ? theme.BLURPLE : theme.TEXT_POSITIVE};
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  border-radius: 4px;
  font-weight: 500;
  padding: 4px;
  font-size: 14px;
  margin: ${({ alert }) => alert && "8px 0"};
`;

const Docs = () => {
  return (
    <>
      <Head>
        <title>Creating JSON Crack Embed | JSON Crack</title>
        <meta name="description" content="Embedding JSON Crack tutorial into your websites." />
      </Head>
      <StyledPage>
        <Button component="a" href="/">
          &lt; Go Back
        </Button>
        <h1>Documentation</h1>
        <StyledContent>
          <h2># Fetching from URL</h2>
          <StyledContentBody>
            <StyledDescription>
              By adding <StyledHighlight>?json=https://catfact.ninja/fact</StyledHighlight> query at
              the end of iframe src you will be able to fetch from URL at widgets without additional
              scripts. This applies to editor page as well, the following link will fetch the url at
              the editor:{" "}
              <StyledHighlight
                as="a"
                href="https://jsoncrack.com/editor?json=https://catfact.ninja/fact"
                link
              >
                https://jsoncrack.com/editor?json=https://catfact.ninja/fact
              </StyledHighlight>
            </StyledDescription>

            <StyledFrame
              scrolling="no"
              title="Untitled"
              src="https://codepen.io/AykutSarac/embed/KKBpWVR?default-tab=html%2Cresult"
              loading="eager"
            >
              See the Pen <a href="https://codepen.io/AykutSarac/pen/KKBpWVR">Untitled</a> by Aykut
              Saraç (<a href="https://codepen.io/AykutSarac">@AykutSarac</a>) on{" "}
              <a href="https://codepen.io">CodePen</a>.
            </StyledFrame>
          </StyledContentBody>
        </StyledContent>
        <StyledContent>
          <h2># Embed Saved JSON</h2>
          <StyledContentBody>
            <StyledDescription>
              Just like fetching from URL above, you can embed saved public json by adding the json
              id to &quot;json&quot; query{" "}
              <StyledHighlight>?json=639b65c5a82efc29a24b2de2</StyledHighlight>
            </StyledDescription>
            <StyledFrame
              scrolling="no"
              title="Untitled"
              src="https://codepen.io/AykutSarac/embed/vYaORgM?default-tab=html%2Cresult"
              loading="lazy"
            >
              See the Pen <a href="https://codepen.io/AykutSarac/pen/vYaORgM">Untitled</a> by Aykut
              Saraç (<a href="https://codepen.io/AykutSarac">@AykutSarac</a>) on{" "}
              <a href="https://codepen.io">CodePen</a>.
            </StyledFrame>
          </StyledContentBody>
        </StyledContent>
        <StyledContent>
          <h2># Communicating with API</h2>
          <h3>◼︎ Post Message to Embed</h3>
          <StyledContentBody>
            <StyledDescription>
              Communicating with the embed is possible with{" "}
              <StyledHighlight
                as="a"
                href="https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/postMessage"
                link
              >
                MessagePort
              </StyledHighlight>
              , you should pass an object consist of &quot;json&quot; and &quot;options&quot; key
              where json is a string and options is an object that may contain the following:
              <SyntaxHighlighter language="markdown" style={materialDark} showLineNumbers={true}>
                {`{\n\ttheme: "light" | "dark",\n\tdirection: "TOP" | "RIGHT" | "DOWN" | "LEFT"\n}`}
              </SyntaxHighlighter>
            </StyledDescription>

            <StyledFrame
              scrolling="no"
              title="Untitled"
              src="https://codepen.io/AykutSarac/embed/rNrVyWP?default-tab=html%2Cresult"
              loading="lazy"
            >
              See the Pen <a href="https://codepen.io/AykutSarac/pen/rNrVyWP">Untitled</a> by Aykut
              Saraç (<a href="https://codepen.io/AykutSarac">@AykutSarac</a>) on{" "}
              <a href="https://codepen.io">CodePen</a>.
            </StyledFrame>
          </StyledContentBody>
        </StyledContent>
        <StyledContent>
          <h3>◼︎ On Page Load</h3>
          <StyledContentBody>
            <StyledDescription>
              <StyledHighlight as="div" alert>
                ⚠️ <b>Important!</b> - iframe should be defined before the script tag
              </StyledHighlight>
              <StyledHighlight as="div" alert>
                ⚠️ <b>Note</b> - postMessage should be delayed using setTimeout
              </StyledHighlight>
              To display JSON on load event, you should post json into iframe using it&apos;s onload
              event like in the example. Make sure to use{" "}
              <StyledHighlight>setTimeout</StyledHighlight> when loading data and set a time around
              500ms otherwise it won&apos;t work.
            </StyledDescription>
            <StyledFrame
              scrolling="no"
              title="Untitled"
              src="https://codepen.io/AykutSarac/embed/QWBbpqx?default-tab=html%2Cresult"
              loading="lazy"
            >
              See the Pen <a href="https://codepen.io/AykutSarac/pen/QWBbpqx">Untitled</a> by Aykut
              Saraç (<a href="https://codepen.io/AykutSarac">@AykutSarac</a>) on{" "}
              <a href="https://codepen.io">CodePen</a>.
            </StyledFrame>
          </StyledContentBody>
        </StyledContent>
      </StyledPage>
      <Footer />
    </>
  );
};

export default Docs;
