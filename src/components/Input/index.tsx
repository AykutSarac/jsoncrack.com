import React from "react";
import { useConfig } from "src/hocs/config";
import { ConfigActionType } from "src/reducer/reducer";
import styled from "styled-components";

const StyledInputWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  transform: translate(-5%, 100%);
  z-index: 1;

  background: ${({ theme }) => theme.BLACK_SECONDARY};
  padding: 6px;
  border-radius: 5px;
  box-shadow: 0 3px 10px rgb(0 0 0 / 10%), 0 3px 3px rgb(0 0 0 / 5%);
  width: 200px;
`;

const StyledInput = styled.input`
  outline: none;
  border: none;
  background: none;
  border-bottom: 1px solid ${({ theme }) => theme.SILVER_DARK};
  color: ${({ theme }) => theme.SILVER};
  font-size: 14px;
  width: 100%;
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

  return (
    <StyledInputWrapper>
      <StyledInput
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </StyledInputWrapper>
  );
};
