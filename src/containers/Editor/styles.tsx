import SplitPane from "react-split-pane";
import styled from "styled-components";

export const StyledPageWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

export const StyledEditorWrapper = styled.div`
  width: 100%;
  overflow: hidden;

  @media only screen and (max-width: 568px) {
    display: none;
  }
`;

export const StyledEditor = styled(SplitPane)`
  position: relative !important;
  display: flex;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};

  .Resizer {
    background: ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
    box-sizing: border-box;
    background-clip: padding-box;
    z-index: 1;
  }

  .Resizer.disabled {
    pointer-events: none;
  }

  .Resizer:hover {
    transition: all 2s ease;
  }

  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }

  .Resizer.horizontal:hover {
    border-top: 5px solid rgba(0, 0, 0, 0);
    border-bottom: 5px solid rgba(0, 0, 0, 0);
  }

  .Resizer.vertical {
    width: 14px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
    z-index: 1;
  }

  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0);
    border-right: 5px solid rgba(0, 0, 0, 0);
  }

  .Resizer.disabled {
    cursor: not-allowed;
  }

  .Resizer.disabled:hover {
    border-color: transparent;
  }
`;
