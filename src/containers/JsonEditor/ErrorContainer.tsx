import React from "react";
import styled from "styled-components";
import {
  MdExpandMore,
  MdExpandLess,
  MdReportGmailerrorred,
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

const StyledErrorHeader = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.BLACK_DARK};
  padding: 6px 12px;
  color: ${({ theme }) => theme.DANGER};
  font-size: 22px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.DANGER};
  }
`;

const StyledTitle = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  gap: 10px;
`;

const StyledError = styled.pre`
  color: ${({ theme }) => theme.DANGER};
  border: 1px solid ${({ theme }) => theme.SILVER_DARK};
  border-left: none;
  border-right: none;
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
        onClick={() =>
          setError((err: Error) => ({ ...err, isExpanded: !err.isExpanded }))
        }
      >
        <StyledTitle>
          <MdReportGmailerrorred size={26} /> Error
        </StyledTitle>
        {error.isExpanded ? (
          <MdExpandLess size={22} />
        ) : (
          <MdExpandMore size={22} />
        )}
      </StyledErrorHeader>
      {error.isExpanded && <StyledError>{error.message}</StyledError>}
    </StyledErrorWrapper>
  );
};
