import React from "react";
import { Modal, Group, Button, Divider, ModalProps, Text, Image, Anchor } from "@mantine/core";
import { toast } from "react-hot-toast";
import { altogic } from "src/api/altogic";

export const CancelPremiumModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const [cancelling, setCancelling] = React.useState(false);

  const cancelSub = async () => {
    try {
      setCancelling(true);
      const { errors } = await altogic.endpoint.delete("/subscription");

      if (errors?.items.length) {
        return toast.error(
          "An error occured while cancelling plan! Please contact aykut@jsoncrack.com"
        );
      }

      toast.success("Cancelled premium plan!");
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Modal title="CANCEL PREMIUM?" opened={opened} onClose={onClose} centered>
      <Image py="xs" src="assets/taken.svg" mx="auto" width={200} alt="taken" />
      <Text fz="sm" pb="md">
        Cancellation will take effect at the end of your current billing period.
        <br />
        <br />
        You can restart your subscription anytime.
        <br />
        <Text size="xs" color="dimmed">
          If you have problems with cancelling plan please contact: aykut@jsoncrack.com
        </Text>
        <Anchor target="_blank" href="https://patreon.com/herowand">
          Click here to cancel if you are Patreon member
        </Anchor>
      </Text>
      <Divider py="xs" />
      <Group position="right">
        <Button color="dark" variant="subtle" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={cancelSub} loading={cancelling} color="red">
          QUIT SUBSCRIPTION
        </Button>
      </Group>
    </Modal>
  );
};
