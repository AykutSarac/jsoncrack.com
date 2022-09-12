import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { useFocusNode } from "src/hooks/useFocusNode";
import styled from "styled-components";

const StyledInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  border-radius: 4px;
  height: 25px;
`;

const StyledForm = styled.form`
  display: flex;
  align-items: center;
  padding: 4px 6px;
`;

const StyledInput = styled.input`
  background: none;
  color: ${({ theme }) => theme.TEXT_NORMAL};
  outline: none;
  border: none;
  width: 112px;
  font-size: 14px;
  font-weight: 500;
  transition: width 0.3s;

  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    display: none;
  }

  &:focus {
    width: 208px;
  }
`;

const StyledSearchButton = styled.button`
  display: grid;
  background: none;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  padding: 0;
  min-height: unset;

  &:hover {
    box-shadow: none;
  }
`;

export const SearchInput: React.FC = () => {
  const [content, setContent, skip] = useFocusNode();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    skip();
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setContent({ value: "", debounced: "" });
  };

  return (
    <StyledInputWrapper>
      <StyledForm onSubmit={onSubmit}>
        <StyledInput
          type="text"
          value={content.value}
          onChange={e => setContent(val => ({ ...val, value: e.target.value }))}
          placeholder="Search Node"
        />
        <StyledSearchButton type="reset" aria-label="search" onClick={handleClear}>
          {content.value ? (
            <IoCloseSharp size={18} />
          ) : (
            <AiOutlineSearch size={18} />
          )}
        </StyledSearchButton>
      </StyledForm>
    </StyledInputWrapper>
  );
};
