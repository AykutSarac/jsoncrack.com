import styled, { keyframes } from "styled-components";

const appearAnimation = keyframes`
  from { transform: scale(0.6); opacity: 0; }
  to { transform: scale(1); opacity: 1; };
`;

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.85);
  z-index: 36;

  * {
    box-sizing: border-box;
  }
`;

export const ModalInnerWrapper = styled.div<{ size: "sm" | "md" | "lg" }>`
  min-width: 440px;
  max-width: ${({ size }) => (size === "sm" ? "490px" : size === "md" ? "50%" : "80%")};
  width: fit-content;
  animation: ${appearAnimation} 220ms ease-in-out;
  line-height: 20px;

  @media only screen and (max-width: 768px) {
    min-width: 90%;
    max-width: 90%;
  }
`;

export const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.INTERACTIVE_ACTIVE};
  font-size: 20px !important;
  margin: 0 !important;
`;

export const HeaderWrapper = styled.div`
  background: ${({ theme }) => theme.MODAL_BACKGROUND};
  padding: 16px;
  border-radius: 5px 5px 0 0;
`;

export const ContentWrapper = styled.div`
  background: ${({ theme }) => theme.MODAL_BACKGROUND};
  padding: 16px;
  overflow: hidden auto;
  max-height: 500px;
`;

export const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  padding: 12px;
  border-radius: 0 0 5px 5px;
  gap: 10px;
`;
