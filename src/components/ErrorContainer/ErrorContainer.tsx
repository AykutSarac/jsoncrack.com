import React from "react";
import styled from "styled-components";
import {
  MdExpandMore,
  MdExpandLess,
  MdReportGmailerrorred,
  MdOutlineCheckCircleOutline,
} from "react-icons/md";

export type Error = {
  message: string;
  isExpanded: boolean;
};

interface ErrorContainerProps {
  error: Error;
  setError: React.Dispatch<React.SetStateAction<Error>>;
}

const StyledErrorWrapper = styled.div`
  z-index: 1;
`;

const StyledErrorExpand = styled.button<{ error: boolean }>`
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
    box-shadow: none;
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

export const ErrorContainer: React.FC<ErrorContainerProps> = ({
  error,
  setError,
}) => {
  return (
    <StyledErrorWrapper>
      <StyledErrorExpand
        error={!!error.message}
        onClick={() =>
          setError((err: Error) => ({ ...err, isExpanded: !err.isExpanded }))
        }
      >
        <StyledTitle>
          {error.message ? (
            <MdReportGmailerrorred size={20} />
          ) : (
            <MdOutlineCheckCircleOutline size={20} />
          )}
          {error.message ? "Error" : "JSON Valid"}
        </StyledTitle>
        {error.message &&
          (error.isExpanded ? (
            <MdExpandLess size={22} />
          ) : (
            <MdExpandMore size={22} />
          ))}
      </StyledErrorExpand>
      {error.isExpanded && error.message && (
        <StyledError>{error.message}</StyledError>
      )}
    </StyledErrorWrapper>
  );
};
