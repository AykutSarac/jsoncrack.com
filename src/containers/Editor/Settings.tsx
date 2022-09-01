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

export const Settings: React.FC<{
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ visible, setVisible }) => {
  const [toggleHideCollapse, hideCollapse] = useStored(
    (state) => [state.toggleHideCollapse, state.hideCollapse],
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
        </StyledModalWrapper>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible} />
    </Modal>
  );
};
