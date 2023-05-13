import React from "react";
import Head from "next/head";
import styled from "styled-components";
import { MediaQuery, Text } from "@mantine/core";
import { Prism } from "@mantine/prism";
import Layout from "src/layout/Layout";

const StyledFrame = styled.iframe`
  border: none;
  width: 80%;
  flex: 500px;
  margin: 3% auto;
`;

const StyledPage = styled.div`
  padding: 0 5%;
`;

const StyledContent = styled.section`
  margin-top: 20px;
  background: rgba(96, 96, 96, 0.23);
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #383838;
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
  display: inline-block;
  text-align: left;
  color: ${({ theme, link, alert }) =>
    alert ? theme.DANGER : link ? theme.BLURPLE : theme.TEXT_POSITIVE};
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  border-radius: 4px;
  font-weight: 500;
  padding: 2px 4px;
  font-size: 14px;
  margin: ${({ alert }) => (alert ? "8px 0" : "1px")};
`;

const Docs = () => {
  return (
    <Layout>
      <Head>
        <title>Creating JSON Crack Embed | JSON Crack</title>
        <meta name="description" content="Embedding JSON Crack tutorial into your websites." />
      </Head>
      <StyledPage>
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
              <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                <Prism w={500} language="json">
                  {`{\n  theme: "light" | "dark",\n  direction: "TOP" | "RIGHT" | "DOWN" | "LEFT"\n}`}
                </Prism>
              </MediaQuery>
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
              <Text>
                ⚠️ <b>Important!</b> - iframe should be defined before the script tag
              </Text>
              <Text>
                ⚠️ <b>Note</b> - Widget is not loaded immediately with the parent page. The widget
                sends its <b>id</b> attribute so you can listen for it as in the example below to
                ensure its loaded and ready to listen for messages.
              </Text>
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
    </Layout>
  );
};

export default Docs;
