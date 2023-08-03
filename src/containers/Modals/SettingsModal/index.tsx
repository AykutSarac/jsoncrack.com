import React from "react";
import { Modal, Group, Switch, Stack, ModalProps } from "@mantine/core";
import useStored from "src/store/useStored";

export const SettingsModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const setLightTheme = useStored(state => state.setLightTheme);
  const toggleHideCollapse = useStored(state => state.toggleHideCollapse);
  const toggleChildrenCount = useStored(state => state.toggleChildrenCount);
  const toggleImagePreview = useStored(state => state.toggleImagePreview);
  const hideCollapse = useStored(state => state.hideCollapse);
  const childrenCount = useStored(state => state.childrenCount);
  const imagePreview = useStored(state => state.imagePreview);
  const lightmode = useStored(state => state.lightmode);

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
