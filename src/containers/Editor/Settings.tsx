import React from "react";
import toast from "react-hot-toast";
import { IoAlertCircleSharp } from "react-icons/io5";
import { Modal } from "src/components/Modal";
import Toggle from "src/components/Toggle";
import { useConfig } from "src/hocs/config";
import { ConfigActionType } from "src/reducer/reducer";
import styled from "styled-components";

const StyledToggle = styled(Toggle)`
  flex-flow: row-reverse;
  background: black;
`;

const StyledAlertIcon = styled(IoAlertCircleSharp)`
  color: ${({ theme }) => theme.ORANGE};
`;

export const Settings: React.FC<{
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ visible, setVisible }) => {
  const { settings, dispatch } = useConfig();

  const togglePerformance = () => {
    const toastMsg = settings.performance
      ? "Disabled Performance Mode\nSearch Node & Save Image enabled."
      : "Enabled Performance Mode\nSearch Node & Save Image disabled.";

    toast(toastMsg, {
      icon: <StyledAlertIcon size={36} />,
      duration: 3000,
    });

    dispatch({ type: ConfigActionType.TOGGLE_PERFORMANCE });
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Settings</Modal.Header>
      <Modal.Content>
        <StyledToggle
          onChange={togglePerformance}
          checked={settings.performance}
        >
          Performance Mode (Experimental)
        </StyledToggle>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible} />
    </Modal>
  );
};
