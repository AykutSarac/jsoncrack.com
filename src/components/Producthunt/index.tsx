import React from "react";
import styled from "styled-components";

const StyledImage = styled.img`
  object-fit: contain;
  max-width: 300px;

  @media only screen and (max-width: 768px) {
    width: 200px;
    height: auto;
  }
`;

export const Producthunt = () => {
  return (
    <a
      href="https://www.producthunt.com/posts/json-visio?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-json-visio"
      target="_blank"
      rel="me"
    >
      <StyledImage
        width="500"
        height="200"
        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=332281&theme=neutral"
        alt="JSON Visio - Simple visualization tool for your JSON data. | Product Hunt"
      />
    </a>
  );
};
