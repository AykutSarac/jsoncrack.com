import React from "react";
import styled from "styled-components";

const StyledJsonEditor = styled.textarea`
  height: 100%;
  width: 30%;
  outline: none;
  border: none;
  resize: none;
  background: black;
  opacity: .5;
  color: white;
`;

const JsonEditor = () => {
  return <StyledJsonEditor defaultValue="a" />;
};

export default JsonEditor;
