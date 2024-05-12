import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Group, Paper, Stack, TextInput, Text, Anchor, PasswordInput } from "@mantine/core";
import { toast } from "react-hot-toast";
import Layout from "src/layout/Layout";
import { supabase } from "src/lib/api/supabase";

function ResetPassword() {
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
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            label="New Password"
            radius="sm"
            placeholder="∗∗∗∗∗∗∗∗∗∗∗"
            style={{ color: "black" }}
          />
          <PasswordInput
            name="password"
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

const ForgotPassword = () => {
  const { query } = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const isPasswordReset = query?.type === "recovery" && !query?.error;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw new Error(error.message);

      setSuccess(true);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Reset Password - JSON Crack</title>
        <link rel="canonical" href="https://app.jsoncrack.com/forgot-password" />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      {isPasswordReset ? (
        <ResetPassword />
      ) : (
        <Paper mx="auto" mt={100} maw={400} p="lg" withBorder>
          <Text size="lg" w={500} c="dark">
            Reset Password
          </Text>
          <Paper pt="lg">
            {success ? (
              <Text>We&apos;ve sent an email to you, please check your inbox.</Text>
            ) : (
              <form onSubmit={onSubmit}>
                <Stack>
                  <TextInput
                    name="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    label="Email"
                    placeholder="hello@jsoncrack.com"
                    radius="sm"
                    style={{ color: "black" }}
                  />
                </Stack>

                <Group justify="apart" mt="xl">
                  <Button color="dark" type="submit" radius="sm" loading={loading} fullWidth>
                    Reset Password
                  </Button>
                </Group>
                <Stack mt="lg" align="center">
                  <Anchor component={Link} prefetch={false} href="/sign-in" c="dark" size="xs">
                    Don&apos;t have an account? Sign Up
                  </Anchor>
                </Stack>
              </form>
            )}
          </Paper>
        </Paper>
      )}
    </Layout>
  );
};

export default ForgotPassword;
