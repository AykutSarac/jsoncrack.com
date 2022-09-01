import React from "react";
import styled from "styled-components";
import {
  MdExpandMore,
  MdExpandLess,
  MdReportGmailerrorred,
  MdOutlineCheckCircleOutline,
} from "react-icons/md";

const StyledErrorWrapper = styled.div`
  z-index: 1;
`;

const StyledErrorExpand = styled.button<{ error: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  padding: 4px 16px;
  height: 36px;
  border-radius: 0;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme, error }) =>
    error ? theme.TEXT_DANGER : theme.TEXT_POSITIVE};
  pointer-events: ${({ error }) => !error && "none"};
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  box-shadow: 0 1px 0px ${({ theme }) => theme.BACKGROUND_TERTIARY};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.TEXT_DANGER};
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0 0);
  }
`;

const StyledTitle = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  gap: 10px;
  font-size: 16px;
`;

const StyledError = styled.pre`
  color: ${({ theme }) => theme.TEXT_DANGER};
  border-bottom: 1px solid ${({ theme }) => theme.SILVER_DARK};
  font-size: 12px;
  padding: 12px;
  margin: 0;
  word-wrap: break-word;
  white-space: pre-line;
`;

export const ErrorContainer = ({ error }: { error: string }) => {
  const [isErrorExpanded, setErrorExpanded] = React.useState(true);

  return (
    <StyledErrorWrapper>
      <StyledErrorExpand
        error={!!error.length}
        onClick={() => setErrorExpanded(!isErrorExpanded)}
      >
        <StyledTitle>
          {error ? (
            <MdReportGmailerrorred size={20} />
          ) : (
            <MdOutlineCheckCircleOutline size={20} />
          )}
          {error ? "Error" : "JSON Valid"}
        </StyledTitle>
        {error &&
          (isErrorExpanded ? (
            <MdExpandLess size={22} />
          ) : (
            <MdExpandMore size={22} />
          ))}
      </StyledErrorExpand>
      {isErrorExpanded && error && <StyledError>{error}</StyledError>}
    </StyledErrorWrapper>
  );
};
