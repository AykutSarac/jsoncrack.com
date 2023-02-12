import React from "react";
import styled from "styled-components";

const StyledInputWrapper = styled.div`
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  width: 100%;
  border-radius: 4px;
`;

const StyledForm = styled.div`
  display: flex;

  flex: 1;
`;

const StyledInput = styled.input`
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  outline: none;
  border: none;
  border-radius: 4px;
  line-height: 32px;
  padding: 10px;
  width: 100%;
  height: 40px;
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  padding: 0 10px;
  min-height: unset;
  text-transform: uppercase;

  &:hover {
    box-shadow: none;
  }

  &.active {
    background: ${({ theme }) => theme.PRIMARY};
    color: white;
    outline: 3px solid ${({ theme }) => theme.BACKGROUND_TERTIARY};
    border-radius: 10px;
  }
`;

export interface InputProps {
  value: string | number | string[];
  extensions: string[];
  activeExtension: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  setExtension: (value: number) => void;
}
export const FileInput: React.FC<InputProps> = ({
  setExtension,
  activeExtension,
  onChange,
  extensions,
  value,
}) => {
  return (
    <StyledInputWrapper>
      <StyledForm>
        <StyledInput type="text" onChange={onChange} value={value} placeholder="File Name" />
        {extensions.map((ext, key) => (
          <StyledButton
            className={`${activeExtension === key && "active"}`}
            key={key}
            aria-label="search"
            onClick={() => setExtension(key)}
          >
            {ext}
          </StyledButton>
        ))}
      </StyledForm>
    </StyledInputWrapper>
  );
};
