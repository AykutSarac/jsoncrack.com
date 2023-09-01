import React from "react";
import Head from "next/head";
import Link from "next/link";
import { PaperProps, Button, Group, Paper, Stack, TextInput, Text, Anchor } from "@mantine/core";
import { toast } from "react-hot-toast";
import { Footer } from "src/layout/Footer";
import { JSONCrackLogo } from "src/layout/JsonCrackLogo";
import { Navbar } from "src/layout/Navbar";
import { supabase } from "src/lib/api/supabase";

export function AuthenticationForm(props: PaperProps) {
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
    <Paper pt="lg" {...props}>
      <Text size="lg" weight={500}>
        Reset Password
      </Text>

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
              size="md"
              radius="sm"
            />
          </Stack>

          <Group position="apart" mt="xl">
            <Button type="submit" radius="sm" size="md" loading={loading} fullWidth>
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
  );
}

const ResetPassword = () => {
  return (
    <div>
      <Head>
        <title>Reset Password - JSON Crack</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Navbar />
      <Paper mx="auto" mt={70} maw={400} p="lg" withBorder>
        <JSONCrackLogo />
        <AuthenticationForm />
      </Paper>
      <Footer />
    </div>
  );
};

export default ResetPassword;
