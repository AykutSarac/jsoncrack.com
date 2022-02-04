import React from "react";
import styled from "styled-components";
import { ReactFlowProvider } from "react-flow-renderer";
import { FlowWrapper } from "./FlowWrapper";

const StyledLiveEditor = styled.div`
  width: 100%;
  height: 100%;
  border-left: 1px solid ${({ theme }) => theme.SILVER_DARK};

  .react-flow__controls {
    display: grid;
    grid-auto-flow: dense;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 1fr;
    gap: 8px;
    right: 10px;
    left: unset;
  }

  .react-flow__minimap {
    top: 8px;
    right: 8px;
    background: transparent;

    .react-flow__minimap-mask {
      fill: ${({ theme }) => theme.SILVER_DARK};
      opacity: 0.5;
    }
  }

  .react-flow__controls-button {
    background: ${({ theme }) => theme.BLACK_PRIMARY};
    fill: ${({ theme }) => theme.SILVER};
    color: ${({ theme }) => theme.SILVER};
    font-weight: 600;
    border: 1px solid ${({ theme }) => theme.BLACK};

    &:hover {
      background: unset;
    }
  }
`;

export const LiveEditor: React.FC = () => {
  return (
    <StyledLiveEditor>
      <ReactFlowProvider>
        <FlowWrapper />
      </ReactFlowProvider>
    </StyledLiveEditor>
  );
};
