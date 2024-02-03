"use client";

import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, Group, Paper, Stack, TextInput, Text, Anchor } from "@mantine/core";
import { toast } from "react-hot-toast";
import Layout from "src/layout/Layout";
import { supabase } from "src/lib/api/supabase";
import { ResetPassword } from "./ResetPassword";

export default function Page() {
  const query = useSearchParams();
  const typeParam = query?.get("type");
  const errorParam = query?.get("error");
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const isPasswordReset = typeParam === "recovery" && !errorParam;

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
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      {isPasswordReset ? (
        <ResetPassword />
      ) : (
        <Paper mx="auto" mt={70} maw={400} p="lg" withBorder>
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
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    label="Email"
                    placeholder="hello@herowand.com"
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
}
