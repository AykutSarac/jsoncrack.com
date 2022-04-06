import React from "react";
import styled from "styled-components";

const StyledProducthunt = styled.a`
  position: fixed;
  bottom: 12px;
  right: 12px;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const StyledImage = styled.img`
  width: 250px;
  height: 54px;

  @media only screen and (max-width: 768px) {
    width: 200px;
    height: auto;
  }
`;

export const Producthunt = () => {
  return (
    <StyledProducthunt
      href="https://www.producthunt.com/posts/json-visio?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-json-visio"
      target="_blank"
      rel="me"
    >
      <StyledImage
        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=332281&theme=light"
        alt="JSON Visio - Simple visualization tool for your JSON data. | Product Hunt"
      />
    </StyledProducthunt>
  );
};
