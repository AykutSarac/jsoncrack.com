import React from "react";
import { ColorSwatch } from "@mantine/core";
import styled from "styled-components";

const StyledRow = styled.span`
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  gap: 4px;
  vertical-align: middle;
`;

const isURL = (word: string) => {
  const urlPattern =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;

  return word.match(urlPattern);
};

const Linkify = (text: string) => {
  const addMarkup = (word: string) => {
    return isURL(word)
      ? `<a onclick="event.stopPropagation()" href="${word}" style="text-decoration: underline; pointer-events: all;" target="_blank" rel="noreferrer">${word}</a>`
      : word;
  };

  const words = text.split(" ");
  const formatedWords = words.map(w => addMarkup(w));
  const html = formatedWords.join(" ");
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

interface TextRendererProps {
  children: string;
}

export const TextRenderer = ({ children }: TextRendererProps) => {
  const text = children?.replaceAll('"', "");

  if (isURL(text)) return Linkify(text);

  if (isColorFormat(text)) {
    return (
      <StyledRow>
        <ColorSwatch size={12} radius={4} mr={4} color={text} />
        {text}
      </StyledRow>
    );
  }
  return <>{children}</>;
};

function isColorFormat(colorString: string) {
  const hexCodeRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbRegex = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;
  const rgbaRegex = /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(0|1|0\.\d+)\s*\)$/;

  return (
    hexCodeRegex.test(colorString) || rgbRegex.test(colorString) || rgbaRegex.test(colorString)
  );
}
