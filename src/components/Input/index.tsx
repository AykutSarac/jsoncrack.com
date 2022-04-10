import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { useConfig } from "src/hocs/config";
import { ConfigActionType } from "src/reducer/reducer";
import styled from "styled-components";

const StyledInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  border-radius: 4px;
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
  color: inherit;
  padding: 0;
  min-height: unset;
`;

export const Input = () => {
  const { dispatch } = useConfig();
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    const debouncer = setTimeout(() => {
      dispatch({ type: ConfigActionType.SET_SEARCH_NODE, payload: value });
    }, 1500);

    return () => clearTimeout(debouncer);
  }, [value, dispatch]);

  const handleClick = () => {
    setValue("");
  };

  return (
    <StyledInputWrapper>
      <StyledInput
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search Node"
      />
      <StyledSearchButton onClick={handleClick}>
        {value ? <IoCloseSharp size={18} /> : <AiOutlineSearch size={18} />}
      </StyledSearchButton>
    </StyledInputWrapper>
  );
};
