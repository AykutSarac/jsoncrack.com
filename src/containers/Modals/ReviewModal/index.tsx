import React from "react";
import type { ModalProps } from "@mantine/core";
import { Button, Modal, Rating, Text, Textarea } from "@mantine/core";
import { toast } from "react-hot-toast";
import { supabase } from "src/lib/api/supabase";

export const ReviewModal = ({ opened, onClose }: ModalProps) => {
  const [stars, setStars] = React.useState(0);
  const [review, setReview] = React.useState("");

  return (
    <Modal
      title="Leave a Review"
      opened={opened}
      onClose={() => {
        onClose();
        setStars(0);
        setReview("");
      }}
      centered
    >
      <form
        onSubmit={e => {
          e.preventDefault();
          if (stars === 0 && !review.length) return onClose();
          supabase
            .from("reviews")
            .insert({ stars, review })
            .then(({ error }) => {
              if (error) return toast.error(error.message);
              toast.success("Thank you for your feedback!");
            });
          onClose();
        }}
      >
        <Text style={{ textAlign: "center" }}>How was your experience?</Text>
        <Rating value={stars} onChange={setStars} my="lg" size="xl" mx="auto" />
        <Textarea
          placeholder="Please provide feedback on how we can enhance the product and let us know which features you require."
          value={review}
          onChange={e => setReview(e.currentTarget.value)}
          minLength={10}
          maxLength={500}
          minRows={5}
          maxRows={10}
          autosize
        />
        <Text fz={12} c="dimmed" style={{ textAlign: "right" }}>
          500/{review.length}
        </Text>
        <Text fz={12}>
          * Your feedback is kept anonymous. If you wish to be contacted, please provide your email
          address along with your feedback.
        </Text>
        <Button type="submit" mt="lg" fullWidth>
          Submit
        </Button>
      </form>
    </Modal>
  );
};
