import React from "react";
import { Modal, Group, Switch, Stack, ModalProps } from "@mantine/core";
// import { VscLock } from "react-icons/vsc";
// import useToggleHide from "src/hooks/useToggleHide";
// import useGraph from "src/store/useGraph";
// import useModal from "src/store/useModal";
// import useUser from "src/store/useUser";
import useStored from "src/store/useStored";

export const SettingsModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  // const { validateHiddenNodes } = useToggleHide();
  // const setVisible = useModal(state => state.setVisible);
  // const toggleCollapseAll = useGraph(state => state.toggleCollapseAll);
  // const collapseAll = useGraph(state => state.collapseAll);
  // const isPremium = useUser(state => state.premium);
  const setLightTheme = useStored(state => state.setLightTheme);
  const toggleHideCollapse = useStored(state => state.toggleHideCollapse);
  const toggleChildrenCount = useStored(state => state.toggleChildrenCount);
  const toggleImagePreview = useStored(state => state.toggleImagePreview);
  const toggleGestures = useStored(state => state.toggleGestures);

  const hideCollapse = useStored(state => state.hideCollapse);
  const childrenCount = useStored(state => state.childrenCount);
  const imagePreview = useStored(state => state.imagePreview);
  const lightmode = useStored(state => state.lightmode);
  const gesturesEnabled = useStored(state => state.gesturesEnabled);

  return (
    <Modal title="Settings" opened={opened} onClose={onClose} centered>
      <Group py="sm">
        <Stack>
          <Switch
            label="Enable Trackpad Gestures"
            size="md"
            color="teal"
            onChange={e => toggleGestures(e.currentTarget.checked)}
            checked={gesturesEnabled}
          />
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
          {/* <Switch
            label={
              <Flex align="center" gap="xs">
                Collapse All by Default
                <Badge size="xs" color="violet" variant="outline" radius="sm">
                  35% Faster
                </Badge>
              </Flex>
            }
            size="md"
            color="violet"
            onChange={e => {
              if (isPremium) {
                toggleCollapseAll(e.currentTarget.checked);
                return validateHiddenNodes();
              }
              setVisible("premium")(true);
              onClose();
            }}
            checked={collapseAll}
            offLabel={isPremium ? null : <VscLock size="12" />}
          /> */}
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
