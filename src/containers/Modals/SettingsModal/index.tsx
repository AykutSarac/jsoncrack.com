import React from "react";
import { Modal, Group, Switch, Stack } from "@mantine/core";
import { ModalProps } from "src/components/Modal";
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
    <Modal title="Settings" opened={visible} onClose={() => setVisible(false)} centered>
      <Group py="sm">
        <Stack>
          <Switch
            label="Live Image Preview"
            size="md"
            onChange={e => toggleImagePreview(e.currentTarget.checked)}
            checked={imagePreview}
          />
          <Switch
            label="Display Collapse/Expand Button"
            size="md"
            onChange={e => toggleHideCollapse(e.currentTarget.checked)}
            checked={hideCollapse}
          />
          <Switch
            label="Display Children Count"
            size="md"
            onChange={e => toggleChildrenCount(e.currentTarget.checked)}
            checked={childrenCount}
          />
          <Switch
            label="Light Theme"
            size="md"
            onChange={e => setLightTheme(e.currentTarget.checked)}
            checked={lightmode}
          />
        </Stack>
      </Group>
    </Modal>
  );
};
