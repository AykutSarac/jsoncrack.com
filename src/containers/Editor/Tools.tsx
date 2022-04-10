import React from "react";
import toast from "react-hot-toast";
import {
  AiOutlineFullscreen,
  AiOutlineSave,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import { MdCenterFocusWeak } from "react-icons/md";
import { Input } from "src/components/Input";
import { useConfig } from "src/hocs/config";
import { ConfigActionType } from "src/reducer/reducer";
import styled from "styled-components";

export const StyledTools = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-direction: row-reverse;
  height: 28px;
  padding: 4px 16px;
  border-bottom: 1px solid #1f2124;
  background: ${({ theme }) => theme.BACKGROUND_PRIMARY};
  color: ${({ theme }) => theme.SILVER};
`;

const StyledToolElement = styled.button`
  display: grid;
  place-content: center;
  font-size: 20px;
  background: none;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};

  &:hover {
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
    opacity: 1;
    box-shadow: none;
  }
`;

export const Tools: React.FC = () => {
  const { states, dispatch } = useConfig();
  const handleSave = () => {
    localStorage.setItem("json", states.json);
    toast.success("Saved JSON successfully!");
  };

  const zoomIn = () => dispatch({ type: ConfigActionType.ZOOM_IN });

  const zoomOut = () => dispatch({ type: ConfigActionType.ZOOM_OUT });

  const centerView = () => dispatch({ type: ConfigActionType.CENTER_VIEW });

  const toggleEditor = () => dispatch({ type: ConfigActionType.TOGGLE_DOCK });

  return (
    <StyledTools>
      <StyledToolElement onClick={toggleEditor}>
        <AiOutlineFullscreen />
      </StyledToolElement>
      <Input />
      <StyledToolElement onClick={handleSave}>
        <AiOutlineSave />
      </StyledToolElement>
      <StyledToolElement>
        <MdCenterFocusWeak onClick={centerView} />
      </StyledToolElement>
      <StyledToolElement onClick={zoomOut}>
        <AiOutlineMinus />
      </StyledToolElement>
      <StyledToolElement onClick={zoomIn}>
        <AiOutlinePlus />
      </StyledToolElement>
    </StyledTools>
  );
};
