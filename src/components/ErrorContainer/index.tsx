import React from "react";
import styled from "styled-components";
import { MdReportGmailerrorred, MdOutlineCheckCircleOutline } from "react-icons/md";
import useJson from "src/store/useJson";

const StyledErrorWrapper = styled.div`
  z-index: 1;
`;

const StyledErrorExpand = styled.div<{ error: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  padding: 4px 16px;
  height: 36px;
  border-radius: 0;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme, error }) => (error ? theme.TEXT_DANGER : theme.TEXT_POSITIVE)};
  pointer-events: ${({ error }) => !error && "none"};
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
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

export const ErrorContainer = () => {
  const hasError = useJson(state => state.hasError);

  return (
    <StyledErrorWrapper>
      <StyledErrorExpand error={hasError}>
        <StyledTitle>
          {hasError ? (
            <MdReportGmailerrorred size={20} />
          ) : (
            <MdOutlineCheckCircleOutline size={20} />
          )}
          {hasError ? "Invalid JSON" : "JSON Valid"}
        </StyledTitle>
      </StyledErrorExpand>
    </StyledErrorWrapper>
  );
};
