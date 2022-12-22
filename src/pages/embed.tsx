import React from "react";
import Head from "next/head";
import styled from "styled-components";

const StyledFrame = styled.iframe`
  border: none;
  width: 100%;
  height: 400px;
  flex: 1;
`;

const StyledPage = styled.div`
  padding: 5%;
`;

const StyledContent = styled.div`
  display: flex;
  gap: 20px;
`;

const StyledContentBody = styled.div`
  display: flex;
  line-height: 2;
  flex: 1;
`;

const StyledHighlight = styled.span<{ link?: boolean }>`
  color: ${({ theme, link }) => (link ? theme.BLURPLE : theme.TEXT_POSITIVE)};
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  border-radius: 4px;
  font-weight: 500;
  padding: 4px;
`;

const Embed = () => {
  return (
    <StyledPage>
      <Head>
        <title>Creating JSON Crack Embed | JSON Crack</title>
        <meta name="description" content="Embedding JSON Crack tutorial into your websites." />
      </Head>
      <h1>Embed</h1>
      <h2># Fetching from URL</h2>
      <StyledContent>
        <StyledContentBody>
          <p>
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
          </p>
        </StyledContentBody>

        <StyledFrame
          scrolling="no"
          title="Untitled"
          src="https://codepen.io/AykutSarac/embed/KKBpWVR?default-tab=html%2Cresult"
          loading="lazy"
        >
          See the Pen <a href="https://codepen.io/AykutSarac/pen/KKBpWVR">Untitled</a> by Aykut
          Saraç (<a href="https://codepen.io/AykutSarac">@AykutSarac</a>) on{" "}
          <a href="https://codepen.io">CodePen</a>.
        </StyledFrame>
      </StyledContent>
      <h2># Share Saved JSON</h2>
      <StyledContent>
        <StyledContentBody>
          <p>Just like fetching from URL above, you can embed saved public json by adding the json id as <StyledHighlight>?json=....</StyledHighlight>
          </p>
        </StyledContentBody>

        <StyledFrame
          scrolling="no"
          title="Untitled"
          src="https://codepen.io/AykutSarac/embed/KKBpWVR?default-tab=html%2Cresult"
          loading="lazy"
        >
          See the Pen <a href="https://codepen.io/AykutSarac/pen/KKBpWVR">Untitled</a> by Aykut
          Saraç (<a href="https://codepen.io/AykutSarac">@AykutSarac</a>) on{" "}
          <a href="https://codepen.io">CodePen</a>.
        </StyledFrame>
      </StyledContent>
      <h2># Communicating with API</h2>
      <h3>&gt; Post Message to Embed</h3>
      <StyledContent>
        <StyledContentBody>
          <p>
            Communicating with the embed is possible with{" "}
            <StyledHighlight
              as="a"
              href="https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/postMessage"
              link
            >
              MessagePort
            </StyledHighlight>
            , you should pass an object consist of &quot;json&quot; and &quot;options&quot; key
            where json is string and options is an object that can contain:{" "}
            <StyledHighlight>
              theme (&quot;light&quot;, &quot;dark&quot;), direction (&quot;DOWN&quot;,
              &quot;TOP&quot;, &quot;RIGHT&quot;, &quot;LEFT&quot;)
            </StyledHighlight>.
          </p>
        </StyledContentBody>

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
      </StyledContent>
      <h3>&gt; On Page Load</h3>
      <StyledContent>
        <StyledContentBody>
          <p>
            To display JSON on load event, you should post json into iframe using it&apos;s onload
            event like in the example. Make sure to use{" "}
            <StyledHighlight>setTimeout</StyledHighlight> when loading data and set a time around
            500ms otherwise it won&apos;t work.
          </p>
        </StyledContentBody>

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
      </StyledContent>
    </StyledPage>
  );
};

export default Embed;
