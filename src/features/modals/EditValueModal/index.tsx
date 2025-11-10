import React, { useState } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Button, TextInput, Stack, Flex } from "@mantine/core";

interface EditValueModalProps extends ModalProps {
  initialValue: string;
  onSave: (newValue: string) => void;
}

export const EditValueModal = ({ opened, onClose, initialValue, onSave }: EditValueModalProps) => {
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    onSave(value);
    onClose && onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Value" centered>
      <Stack>
        <TextInput
          label="Value"
          value={value}
          onChange={e => setValue(e.currentTarget.value)}
          autoFocus
        />
        <Flex justify="flex-end" gap="sm">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} color="blue">
            Save
          </Button>
        </Flex>
      </Stack>
    </Modal>
  );
};
