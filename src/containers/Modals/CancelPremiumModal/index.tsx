import React from "react";
import { Modal, Group, Button, Divider, ModalProps, Text, Image, Anchor } from "@mantine/core";
import { toast } from "react-hot-toast";
import { supabase } from "src/lib/api/supabase";
import useModal from "src/store/useModal";

export const CancelPremiumModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const [cancelling, setCancelling] = React.useState(false);
  const showFeedback = useModal(state => state.setVisible("review"));

  const cancelSub = async () => {
    try {
      setCancelling(true);
      const { data: user } = await supabase.auth.getSession();

      if (user) {
        const { error } = await supabase.functions.invoke("lemonsqueezy", {
          method: "DELETE",
          body: {
            jwt: user.session?.access_token,
          },
        });

        if (error) {
          return toast.error(
            "An error occured while cancelling subscription, please contact: contact@jsoncrack.com"
          );
        }

        toast.success("Cancelled premium plan!");
        showFeedback(true);
      } else {
        toast.error("Couldn't fetch user details, please contact: contact@jsoncrack.com");
      }

      toast.success("Cancelled premium plan!");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Modal title="CANCEL PREMIUM?" opened={opened} onClose={onClose} centered>
      <Image py="xs" src="assets/taken.svg" mx="auto" w={200} alt="taken" />
      <Text fz="sm" pb="md">
        Cancellation will take effect at the end of your current billing period.
        <br />
        <br />
        You can restart your subscription anytime.
        <br />
        <Anchor fz="xs" target="_blank" href="https://patreon.com/herowand">
          Click here to cancel if you are Patreon member
        </Anchor>
        <Text size="xs" c="dimmed" mt="lg">
          If you have problems with cancelling plan please contact: contact@jsoncrack.com
        </Text>
      </Text>
      <Divider py="xs" />
      <Group justify="right">
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
