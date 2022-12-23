import React from "react";
import styled, { DefaultTheme } from "styled-components";

enum ButtonType {
  PRIMARY = "PRIMARY",
  SECONDARY = "BLURPLE",
  DANGER = "DANGER",
  SUCCESS = "SEAGREEN",
  WARNING = "ORANGE",
}

interface ButtonProps {
  status?: keyof typeof ButtonType;
  block?: boolean;
}

type ConditionalProps =
  | ({
      link?: boolean;
    } & React.ComponentPropsWithoutRef<"a">)
  | ({
      link?: never;
    } & React.ComponentPropsWithoutRef<"button">);

function getButtonStatus(status: keyof typeof ButtonType, theme: DefaultTheme) {
  return theme[ButtonType[status]];
}

const StyledButton = styled.button<{
  status: keyof typeof ButtonType;
  block: boolean;
}>`
  display: inline-flex;
  align-items: center;
  background: ${({ status, theme }) => getButtonStatus(status, theme)};
  color: #ffffff;
  padding: 8px 16px;
  min-width: 70px;
  min-height: 32px;
  border-radius: 3px;
  font-size: 14px;
  font-weight: 500;
  width: ${({ block }) => (block ? "100%" : "fit-content")};
  height: 40px;
  background-image: none;

  :disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  div {
    white-space: normal;
    margin: 0 auto;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0 0);
  }

  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const StyledButtonContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 600;
`;

export const Button: React.FC<ButtonProps & ConditionalProps> = ({
  children,
  status,
  block = false,
  link = false,
  ...props
}) => {
  return (
    <StyledButton
      as={link ? "a" : "button"}
      type="button"
      status={status ?? "PRIMARY"}
      block={block}
      {...props}
    >
      <StyledButtonContent>{children}</StyledButtonContent>
    </StyledButton>
  );
};
