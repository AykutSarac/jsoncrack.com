import React from "react";
import {
  Modal,
  Group,
  Button,
  Divider,
  ModalProps,
  Text,
  Anchor,
  List,
  Checkbox,
  TextInput,
} from "@mantine/core";
import { toast } from "react-hot-toast";
import { supabase } from "src/lib/api/supabase";
import useModal from "src/store/useModal";
import useUser from "src/store/useUser";

export const CancelPremiumModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const user = useUser(state => state.user?.user_metadata);
  const [cancelling, setCancelling] = React.useState(false);
  const [reasons, setReasons] = React.useState<number[]>([]);
  const [textReason, setTextReason] = React.useState("");
  const showFeedback = useModal(state => state.setVisible("review"));

  const username = user?.full_name || user?.display_name || user?.name;

  const cancelSub = async () => {
    try {
      setCancelling(true);
      const { data: user } = await supabase.auth.getSession();
      if (!user) {
        throw new Error("Couldn't fetch user details, please contact: contact@jsoncrack.com");
      }

      const { error: lmError } = await supabase.functions.invoke("lemonsqueezy", {
        method: "DELETE",
        body: { jwt: user.session?.access_token },
      });

      if (lmError) {
        throw new Error(
          "An error occured while cancelling subscription, please contact: contact@jsoncrack.com"
        );
      }

      const { error: feedbackError } = await supabase.from("cancel_feedback").insert({
        email: user.session?.user.email,
        text_reason: textReason,
        reasons,
      });

      if (feedbackError) {
        throw new Error(feedbackError.message);
      }

      toast.success("Cancelled premium plan!");
      showFeedback(true);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }

      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Modal title="PREMIUM" opened={opened} onClose={onClose} centered>
      <Text fz="lg" fw="bold" pb="md">
        {username}, are you sure you want to cancel?
      </Text>
      <Text fz="sm" pb="lg">
        If you cancel, you will lose access to premium features and existing pricing. Your plan will
        remain active until the end of the current billing cycle.
      </Text>
      <Text fz="sm" fw="bold">
        Why are you cancelling your plan?
      </Text>
      <List icon={<></>} pb="lg">
        <List.Item>
          <Checkbox
            checked={reasons.includes(1)}
            onChange={e => {
              if (e.target.checked) {
                setReasons([...reasons, 1]);
              } else {
                setReasons(reasons.filter(r => r !== 1));
              }
            }}
            label="The software is too difficult to use."
          />
        </List.Item>
        <List.Item>
          <Checkbox
            checked={reasons.includes(2)}
            onChange={e => {
              if (e.target.checked) {
                setReasons([...reasons, 2]);
              } else {
                setReasons(reasons.filter(r => r !== 2));
              }
            }}
            label="I'm not satisfied with its performance."
          />
        </List.Item>
        <List.Item>
          <Checkbox
            checked={reasons.includes(3)}
            onChange={e => {
              if (e.target.checked) {
                setReasons([...reasons, 3]);
              } else {
                setReasons(reasons.filter(r => r !== 3));
              }
            }}
            label="Features I need are missing."
          />
        </List.Item>
        <List.Item>
          <Checkbox
            checked={reasons.includes(4)}
            onChange={e => {
              if (e.target.checked) {
                setReasons([...reasons, 4]);
              } else {
                setReasons(reasons.filter(r => r !== 4));
              }
            }}
            label="I don't use the app enough."
          />
        </List.Item>
      </List>
      <TextInput
        value={textReason}
        onChange={e => setTextReason(e.currentTarget.value)}
        placeholder="Give more details about your reason..."
        pb="lg"
      />
      <Anchor fz="xs" target="_blank" href="https://patreon.com/herowand">
        Click here to cancel if you are Patreon member
      </Anchor>
      <Divider py="xs" />
      <Group justify="right">
        <Button color="red" variant="outline" onClick={onClose}>
          Never mind, keep premium
        </Button>
        <Button onClick={cancelSub} loading={cancelling} color="red">
          Cancel Plan
        </Button>
      </Group>
    </Modal>
  );
};
