import React from "react";
import styled, { DefaultTheme } from "styled-components";

enum ButtonType {
  DEFAULT = "BLURPLE",
  DANGER = "DANGER",
  SUCCESS = "SEAGREEN",
  WARNING = "ORANGE",
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  status?: keyof typeof ButtonType;
}

function getButtonStatus(status: keyof typeof ButtonType, theme: DefaultTheme) {
  return theme[ButtonType[status]];
}

const StyledButton = styled.button<{ status: keyof typeof ButtonType }>`
  background: ${({ status, theme }) => getButtonStatus(status, theme)};
  color: ${({ theme }) => theme.FULL_WHITE};
  cursor: pointer;
`;

const StyledButtonContent = styled.div``;

export const Button: React.FC<ButtonProps> = ({ children, status, ...props }) => {
  return (
    <StyledButton type="button" status={status ?? "DEFAULT"} {...props}>
      <StyledButtonContent>{children}</StyledButtonContent>
    </StyledButton>
  );
};
