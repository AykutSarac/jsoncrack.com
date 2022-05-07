import styled from "styled-components";

export const ModalWrapper = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  display: ${({ visible }) => (visible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.85);
  z-index: 6;

  * {
    box-sizing: border-box;
  }
`;

export const ModalInnerWrapper = styled.div`
  min-width: 40vw;
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.TEXT_NORMAL};
  font-size: 20px !important;
  margin: 0;
`;

export const HeaderWrapper = styled.div`
  background: ${({ theme }) => theme.MODAL_BACKGROUND};
  padding: 16px;
  border-radius: 5px 5px 0 0;
`;

export const ContentWrapper = styled.div`
  color: ${({ theme }) => theme.TEXT_NORMAL};
  background: ${({ theme }) => theme.MODAL_BACKGROUND};
  padding: 16px;
  overflow: hidden scroll;
`;

export const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  padding: 16px;
  border-radius: 0 0 5px 5px;
  gap: 10px;
`;
