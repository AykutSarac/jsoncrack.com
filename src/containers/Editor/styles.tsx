import styled from "styled-components";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

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

export const StyledEditor = styled(Allotment)`
  position: relative !important;
  display: flex;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};

  div[class*="sash-module_sash"] {
    z-index: 3;
  }
`;
