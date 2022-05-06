import React from "react";
import styled, { DefaultTheme } from "styled-components";
import toast from "react-hot-toast";

import { useConfig } from "src/hocs/config";
import { ConfigActionType } from "src/reducer/reducer";

enum ButtonType {
  PRIMARY = "PRIMARY",
  SECONDARY = "BLURPLE",
  DANGER = "DANGER",
  SUCCESS = "SEAGREEN",
  WARNING = "ORANGE",
}

function getButtonStatus(status: keyof typeof ButtonType, theme: DefaultTheme) {
  return theme[ButtonType[status]];
}

const StyledModalWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled.input`
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  outline: none;
  border: none;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
  display: block;
  width: 100%;
`;

const StyledButton = styled.button<{ status: keyof typeof ButtonType }>`
  background: ${({ status, theme }) => getButtonStatus(status, theme)};
  color: #ffffff;
  padding: 8px 16px;
  min-width: 60px;
  margin-right: 10px;

  @media only screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

export const Modal = ({ visible, setVisible }) => {
  const { json, settings, dispatch } = useConfig();
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const fetchJSON = () => {
    fetch(inputRef.current!.value)
      .then((res) => res.json())
      .then((json) => {
        dispatch({
          type: ConfigActionType.SET_JSON,
          payload: JSON.stringify(json),
        });

        setVisible(false);
      })
      .catch((err) => toast.error(err.message));
  };

  const cancel = () => {
    setVisible(false);
  };

  return (
    visible && (
      <StyledModalWrapper>
        <div>
          <h2>Import JSON from URL</h2>

          <div>
            <StyledInput
              ref={inputRef}
              type="url"
              placeholder="URL of JSON to fetch"
            />

            <StyledButton status="PRIMARY" onClick={fetchJSON}>
              Import
            </StyledButton>
            <StyledButton status="DANGER" onClick={cancel}>
              Cancel
            </StyledButton>
          </div>
        </div>
      </StyledModalWrapper>
    )
  );
};
