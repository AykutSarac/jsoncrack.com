import React from "react";
import {
  AiOutlineCloudUpload,
  AiOutlineLink,
  AiOutlineUnlock,
} from "react-icons/ai";
import { VscAccount, VscHeart } from "react-icons/vsc";
import styled from "styled-components";
import { ShareModal } from "../Modals/ShareModal";

const StyledBottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  max-height: 28px;
  height: 28px;
  padding: 0 6px;
`;

const StyledLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 4px;
`;

const StyledRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  gap: 4px;
`;

const StyledBottomBarItem = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  margin: 0;
  height: 28px;
  padding: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};

  &:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0 0);
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
  }
`;

export const BottomBar = () => {
  const [shareVisible, setShareVisible] = React.useState(false);

  return (
    <StyledBottomBar>
      <StyledLeft>
        <StyledBottomBarItem>
          <VscAccount />
          Aykut Saraç
        </StyledBottomBarItem>
        <StyledBottomBarItem>
          <AiOutlineCloudUpload />
          Unsaved Changes
        </StyledBottomBarItem>
        <StyledBottomBarItem>
          <AiOutlineUnlock />
          Public
        </StyledBottomBarItem>
        <StyledBottomBarItem onClick={() => setShareVisible(true)}>
          <AiOutlineLink />
          Share
        </StyledBottomBarItem>
      </StyledLeft>
      <StyledRight>
        <StyledBottomBarItem>
          <VscHeart />
          Support JSON Crack
        </StyledBottomBarItem>
      </StyledRight>
      <ShareModal visible={shareVisible} setVisible={setShareVisible} />
    </StyledBottomBar>
  );
};
