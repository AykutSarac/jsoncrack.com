import React from "react";
import { Modal, ModalProps } from "src/components/Modal";
import Toggle from "src/components/Toggle";
import useStored from "src/store/useStored";
import styled from "styled-components";
import { shallow } from "zustand/shallow";

const StyledToggle = styled(Toggle)`
  flex-flow: row-reverse;
  background: black;
`;

const StyledModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SettingsModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const lightmode = useStored(state => state.lightmode);
  const setLightTheme = useStored(state => state.setLightTheme);

  const [
    toggleHideCollapse,
    toggleChildrenCount,
    toggleImagePreview,
    hideCollapse,
    childrenCount,
    imagePreview,
  ] = useStored(
    state => [
      state.toggleHideCollapse,
      state.toggleChildrenCount,
      state.toggleImagePreview,
      state.hideCollapse,
      state.childrenCount,
      state.imagePreview,
    ],
    shallow
  );

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Settings</Modal.Header>
      <Modal.Content>
        <StyledModalWrapper>
          <StyledToggle onChange={toggleImagePreview} checked={imagePreview}>
            Live Image Preview
          </StyledToggle>
          <StyledToggle onChange={toggleHideCollapse} checked={hideCollapse}>
            Display Collapse/Expand Button
          </StyledToggle>
          <StyledToggle onChange={toggleChildrenCount} checked={childrenCount}>
            Display Children Count
          </StyledToggle>
          <StyledToggle onChange={() => setLightTheme(!lightmode)} checked={lightmode}>
            Light Theme
          </StyledToggle>
        </StyledModalWrapper>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible} />
    </Modal>
  );
};
