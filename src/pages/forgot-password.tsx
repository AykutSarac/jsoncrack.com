import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Button, Group, Paper, Stack, TextInput, Text, Anchor } from "@mantine/core";
import { toast } from "react-hot-toast";
import Layout from "src/layout/Layout";
import { supabase } from "src/lib/api/supabase";

const ForgotPassword = () => {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    supabase.auth
      .resetPasswordForEmail(email)
      .then(({ error }) => {
        if (error) return toast.error(error.message);
        setSuccess(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Layout>
      <Head>
        <title>Reset Password - JSON Crack</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Paper mx="auto" mt={70} maw={400} p="lg" withBorder>
        <Text size="lg" weight={500}>
          Reset Password
        </Text>
        <Paper pt="lg">
          {success ? (
            <Text>We&apos;ve sent an email to you, please check your inbox.</Text>
          ) : (
            <form onSubmit={onSubmit}>
              <Stack>
                <TextInput
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  label="Email"
                  placeholder="hello@herowand.com"
                  radius="sm"
                />
              </Stack>

              <Group position="apart" mt="xl">
                <Button color="dark" type="submit" radius="sm" loading={loading} fullWidth>
                  Reset Password
                </Button>
              </Group>
              <Stack mt="lg" align="center">
                <Anchor component={Link} prefetch={false} href="/sign-in" color="dark" size="xs">
                  Don&apos;t have an account? Sign Up
                </Anchor>
              </Stack>
            </form>
          )}
        </Paper>
      </Paper>
    </Layout>
  );
};

export default ForgotPassword;
