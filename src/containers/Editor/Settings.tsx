import React from "react";
import toast from "react-hot-toast";
import { IoAlertCircleSharp } from "react-icons/io5";
import { Modal } from "src/components/Modal";
import Toggle from "src/components/Toggle";
import useConfig from "src/hooks/store/useConfig";
import useStored from "src/hooks/store/useStored";
import styled from "styled-components";
import shallow from "zustand/shallow";

const StyledToggle = styled(Toggle)`
  flex-flow: row-reverse;
  background: black;
`;

const StyledAlertIcon = styled(IoAlertCircleSharp)`
  color: ${({ theme }) => theme.ORANGE};
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
  const performanceMode = useConfig((state) => state.performanceMode);
  const [toggleHideCollapse, hideCollapse] = useStored(
    (state) => [state.toggleHideCollapse, state.hideCollapse],
    shallow
  );
  const setConfig = useConfig((state) => state.setConfig);

  const togglePerformance = () => {
    const toastMsg = performanceMode
      ? "Disabled Performance Mode\nSearch Node & Save Image enabled."
      : "Enabled Performance Mode\nSearch Node & Save Image disabled.";

    toast(toastMsg, {
      icon: <StyledAlertIcon size={36} />,
      duration: 3000,
    });

    setConfig("performanceMode", !performanceMode);
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Settings</Modal.Header>
      <Modal.Content>
        <StyledModalWrapper>
          <StyledToggle onChange={toggleHideCollapse} checked={hideCollapse}>
            Hide Collapse/Expand Button
          </StyledToggle>
          <StyledToggle onChange={togglePerformance} checked={performanceMode}>
            Performance Mode (Experimental)
          </StyledToggle>
        </StyledModalWrapper>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible} />
    </Modal>
  );
};
