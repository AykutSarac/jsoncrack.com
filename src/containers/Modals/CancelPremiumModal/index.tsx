import React from "react";
import { Modal, Group, Button, Divider, ModalProps, Text, Image } from "@mantine/core";
import { toast } from "react-hot-toast";
import { altogic } from "src/api/altogic";

export const CancelPremiumModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const cancelSub = async () => {
    altogic.endpoint.delete("/subscription").then(({ data, errors }) => {
      if (errors?.items.length) {
        toast.error("An error occured while cancelling plan!");
        console.log(errors.items);
      }
      toast.success("Cancelled premium plan!");
    });
  };

  return (
    <Modal title="CANCEL PREMIUM?" opened={opened} onClose={onClose} centered>
      <Image py="xs" src="assets/taken.svg" mx="auto" width={200} alt="taken" />
      <Text fz="sm" pb="md">
        Cancellation will take effect at the end of your current billing period.
        <br />
        <br />
        You can restart your subscription anytime.
      </Text>
      <Divider py="xs" />
      <Group position="right">
        <Button color="dark" variant="subtle" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={cancelSub} color="red">
          QUIT SUBSCRIPTION
        </Button>
      </Group>
    </Modal>
  );
};
