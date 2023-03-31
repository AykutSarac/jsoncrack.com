import React from "react";
import { Modal, Group, Switch, Stack, ModalProps } from "@mantine/core";
import { shallow } from "zustand/shallow";
import useStored from "src/store/useStored";

export const SettingsModal: React.FC<ModalProps> = ({ opened, onClose }) => {
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
    <Modal title="Settings" opened={opened} onClose={onClose} centered>
      <Group py="sm">
        <Stack>
          <Switch
            label="Live Image Preview"
            size="md"
            color="teal"
            onChange={e => toggleImagePreview(e.currentTarget.checked)}
            checked={imagePreview}
          />
          <Switch
            label="Display Collapse/Expand Button"
            size="md"
            color="teal"
            onChange={e => toggleHideCollapse(e.currentTarget.checked)}
            checked={hideCollapse}
          />
          <Switch
            label="Display Children Count"
            size="md"
            color="teal"
            onChange={e => toggleChildrenCount(e.currentTarget.checked)}
            checked={childrenCount}
          />
          <Switch
            label="Light Theme"
            size="md"
            color="teal"
            onChange={e => setLightTheme(e.currentTarget.checked)}
            checked={lightmode}
          />
        </Stack>
      </Group>
    </Modal>
  );
};
