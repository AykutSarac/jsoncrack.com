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

  &:hover {
    box-shadow: none;
  }
  
  &.active {
    background: ${({ theme }) => theme.PRIMARY};;
  }
`;

export interface ModalProps {
    value:string | number | readonly string[] | undefined,
    extensions:string[]
    setExtension: Function,
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined,
}
export const FileInput: React.FC<ModalProps> = (props) => {

    const {setExtension, onChange,extensions,value } = props
  return (
    <StyledInputWrapper>
      <StyledForm>
        <StyledInput
          type="text"
          onChange={onChange}
          value={value}
          placeholder="File Name"
        />
          {extensions.map((ext,key)=> (<StyledButton key={key} aria-label="search" onClick={()=> setExtension(key)}>
              {ext}
          </StyledButton>))}

      </StyledForm>
    </StyledInputWrapper>
  );
};
