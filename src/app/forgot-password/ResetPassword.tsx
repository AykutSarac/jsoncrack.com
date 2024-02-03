import React from "react";
import { Paper, Stack, PasswordInput, Group, Button, Text } from "@mantine/core";
import toast from "react-hot-toast";
import { supabase } from "src/lib/api/supabase";

export function ResetPassword() {
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);

      if (password !== password2) throw new Error("Passwords do not match");

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw new Error(error.message);

      toast.success("Successfully updated password!");
      setTimeout(() => window.location.assign("/sign-in"), 2000);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper mx="auto" mt={70} maw={400} p="lg" withBorder>
      <Text size="lg" w={500} mb="lg">
        Create New Password
      </Text>

      <form onSubmit={onSubmit}>
        <Stack>
          <PasswordInput
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            label="New Password"
            radius="sm"
            placeholder="∗∗∗∗∗∗∗∗∗∗∗"
            style={{ color: "black" }}
          />
          <PasswordInput
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            required
            label="Validate Password"
            radius="sm"
            placeholder="∗∗∗∗∗∗∗∗∗∗∗"
            style={{ color: "black" }}
          />
        </Stack>

        <Group justify="apart" mt="xl">
          <Button color="dark" type="submit" radius="sm" loading={loading} fullWidth>
            Reset Password
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
