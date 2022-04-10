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

const StyledErrorWrapper = styled.div``;

const StyledErrorHeader = styled.button<{ error: boolean }>`
  display: flex;
  width: 100%;
  border-radius: 0;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.BLACK_DARK};
  padding: 4px 16px;
  color: ${({ theme, error }) => (error ? theme.DANGER : theme.TEXT_POSITIVE)};
  cursor: pointer;
  height: 28px;
  border-bottom: 1px solid #1f2124;
  pointer-events: ${({ error }) => !error && "none"};

  &:hover {
    color: ${({ theme }) => theme.DANGER};
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
  color: ${({ theme }) => theme.DANGER};
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
      <StyledErrorHeader
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
      </StyledErrorHeader>
      {error.isExpanded && error.message && (
        <StyledError>{error.message}</StyledError>
      )}
    </StyledErrorWrapper>
  );
};
