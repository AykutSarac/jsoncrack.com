import React from "react";
import { Button, Modal, ModalProps, Rating, Text, Textarea } from "@mantine/core";
import { toast } from "react-hot-toast";
import { supabase } from "src/lib/api/supabase";

export const ReviewModal: React.FC<ModalProps> = ({ opened, onClose }) => {
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
        <Text align="center">How was your experience?</Text>
        <Rating value={stars} onChange={setStars} my="lg" size="xl" mx="auto" />
        <Textarea
          description="You may include your mail in the feedback if you want us to contact you."
          placeholder="Please provide feedback on how we can enhance the product and let us know which features you require."
          value={review}
          onChange={e => setReview(e.currentTarget.value)}
          minLength={10}
          maxLength={500}
          minRows={5}
        />
        <Text align="right" size={12} color="dimmed">
          500/{review.length}
        </Text>
        <Button type="submit" mt="lg" fullWidth>
          Submit
        </Button>
      </form>
    </Modal>
  );
};
