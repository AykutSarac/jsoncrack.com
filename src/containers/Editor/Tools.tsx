import React from "react";
import toast from "react-hot-toast";
import {
  AiOutlineFullscreen,
  AiOutlineSave,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineSearch,
} from "react-icons/ai";
import { CgDockLeft } from "react-icons/cg";
import { useConfig } from "src/hocs/config";
import { ConfigActionType } from "src/reducer/reducer";
import styled from "styled-components";

export const StyledTools = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-direction: row-reverse;
  height: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.BLACK};
  padding: 4px 16px;
  background: ${({ theme }) => theme.BLACK_SECONDARY};
  color: ${({ theme }) => theme.SILVER};
`;

const StyledToolElement = styled.button`
  display: grid;
  place-content: center;
  font-size: 20px;
  background: none;
  color: ${({ theme }) => theme.FULL_WHITE};
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`;

export const Tools: React.FC = () => {
  const { states, dispatch } = useConfig();
  const handleSave = () => {
    localStorage.setItem("json", states.json);
    toast.success("Saved JSON successfully!");
  };

  const zoomIn = () => {
    dispatch({ type: ConfigActionType.ZOOM_IN });
  };

  const zoomOut = () => {
    dispatch({ type: ConfigActionType.ZOOM_OUT });
  };

  const handleCenter = () => {
    dispatch({ type: ConfigActionType.CENTER_VIEW });
  };

  const handleToggleEditor = () => {
    dispatch({ type: ConfigActionType.TOGGLE_DOCK });
  };

  return (
    <StyledTools>
      <StyledToolElement onClick={handleCenter}>
        <AiOutlineFullscreen />
      </StyledToolElement>
      <StyledToolElement onClick={handleSave}>
        <AiOutlineSave />
      </StyledToolElement>
      <StyledToolElement onClick={handleToggleEditor}>
        <CgDockLeft />
      </StyledToolElement>
      <StyledToolElement onClick={zoomOut}>
        <AiOutlineMinus />
      </StyledToolElement>
      <StyledToolElement onClick={zoomIn}>
        <AiOutlinePlus />
      </StyledToolElement>
      {/* <StyledToolElement>
        <AiOutlineSearch />
      </StyledToolElement> */}
    </StyledTools>
  );
};
