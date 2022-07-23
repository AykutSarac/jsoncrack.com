import React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  outline: none;
  border: none;
  border-radius: 4px;
  line-height: 32px;
  padding: 10px;
  width: 100%;
  margin-bottom: 10px;
  height: 40px;
`;

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = (props) => (
  <StyledInput {...props} />
);
