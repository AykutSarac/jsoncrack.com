import styled from "styled-components";
import { TiFlowMerge } from "react-icons/ti";

export const StyledTools = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 4px;
  justify-content: space-between;
  height: 40px;
  padding: 4px 8px;
  background: ${({ theme }) => theme.TOOLBAR_BG};
  color: ${({ theme }) => theme.SILVER};
  z-index: 36;
  border-bottom: 1px solid ${({ theme }) => theme.SILVER_DARK};

  @media only screen and (max-width: 320px) {
    display: none;
  }
`;

export const StyledToolElement = styled.button<{ $hide?: boolean }>`
  display: ${({ $hide }) => ($hide ? "none" : "grid")};
  place-content: center;
  font-size: 12px;
  background: none;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  padding: 6px;
  border-radius: 3px;
  white-space: nowrap;

  &:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0 0);
  }

  &:hover {
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
    opacity: 1;
    box-shadow: none;
  }
`;

export const StyledFlowIcon = styled(TiFlowMerge)<{ rotate: number }>`
  transform: rotate(${({ rotate }) => `${rotate}deg`});
`;
