import React from "react";
import { Modal } from "src/components/Modal";
import Toggle from "src/components/Toggle";
import useStored from "src/hooks/store/useStored";
import styled from "styled-components";
import shallow from "zustand/shallow";

const StyledToggle = styled(Toggle)`
  flex-flow: row-reverse;
  background: black;
`;

const StyledModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SettingsModal: React.FC<{
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ visible, setVisible }) => {
  const lightmode = useStored(state => state.lightmode);
  const setLightTheme = useStored(state => state.setLightTheme);
  const [toggleHideCollapse, hideCollapse] = useStored(
    state => [state.toggleHideCollapse, state.hideCollapse],
    shallow
  );
  const [toggleHideChildrenCount, hideChildrenCount] = useStored(
    state => [state.toggleHideChildrenCount, state.hideChildrenCount],
    shallow
  );

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Settings</Modal.Header>
      <Modal.Content>
        <StyledModalWrapper>
          <StyledToggle onChange={toggleHideCollapse} checked={hideCollapse}>
            Hide Collapse/Expand Button
          </StyledToggle>
          <StyledToggle
            onChange={toggleHideChildrenCount}
            checked={hideChildrenCount}
          >
            Hide Children Count
          </StyledToggle>
          <StyledToggle
            onChange={() => setLightTheme(!lightmode)}
            checked={lightmode}
          >
            Enable Light Theme
          </StyledToggle>
        </StyledModalWrapper>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible} />
    </Modal>
  );
};
