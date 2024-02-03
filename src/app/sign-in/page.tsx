"use client";

import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TextInput,
  PasswordInput,
  Paper,
  PaperProps,
  Button,
  Divider,
  Anchor,
  Stack,
  Center,
} from "@mantine/core";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { AiOutlineGithub, AiOutlineGoogle } from "react-icons/ai";
import Layout from "src/layout/Layout";
import { supabase } from "src/lib/api/supabase";
import { isIframe } from "src/lib/utils/widget";
import useUser from "src/store/useUser";

function AuthenticationForm(props: PaperProps) {
  const setSession = useUser(state => state.setSession);
  const [loading, setLoading] = React.useState(false);
  const [userData, setUserData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    supabase.auth
      .signInWithPassword({
        email: userData.email,
        password: userData.password,
      })
      .then(({ data, error }) => {
        if (error) return toast.error(error.message);
        setSession(data.session);
      })
      .finally(() => setLoading(false));
  };

  const handleLoginClick = (provider: "github" | "google") => {
    supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: "https://jsoncrack.com/editor" },
    });
  };

  return (
    <Paper {...props}>
      <form onSubmit={onSubmit}>
        <Stack>
          <TextInput
            name="email"
            required
            label="Email"
            placeholder="hello@jsoncrack.com"
            value={userData.email}
            onChange={event => setUserData(d => ({ ...d, email: event.target.value }))}
            radius="sm"
            style={{ color: "black" }}
          />

          <PasswordInput
            name="password"
            required
            label="Password"
            placeholder="∗∗∗∗∗∗∗∗∗∗∗"
            value={userData.password}
            onChange={event => setUserData(d => ({ ...d, password: event.target.value }))}
            radius="sm"
            style={{ color: "black" }}
          />

          <Button color="dark" type="submit" radius="sm" loading={loading}>
            Sign in
          </Button>

          <Stack gap="sm" mx="auto" align="center">
            <Anchor component={Link} prefetch={false} href="/forgot-password" c="dark" size="xs">
              Forgot your password?
            </Anchor>
          </Stack>
        </Stack>
      </form>

      <Divider my="lg" />

      <Stack mb="md" mt="md">
        <Button
          radius="sm"
          leftSection={<AiOutlineGoogle size="20" />}
          onClick={() => handleLoginClick("google")}
          color="red"
          variant="outline"
        >
          Sign in with Google
        </Button>
        <Button
          radius="sm"
          leftSection={<AiOutlineGithub size="20" />}
          onClick={() => handleLoginClick("github")}
          color="dark"
          variant="outline"
        >
          Sign in with GitHub
        </Button>
      </Stack>
    </Paper>
  );
}

export default function Page() {
  const { push } = useRouter();
  const queryParams = useSearchParams();
  const typeParam = queryParams?.get("type");
  const errorParam = queryParams?.get("error");
  const session = useSession();
  const isPasswordReset = typeParam === "recovery" && !errorParam;

  React.useEffect(() => {
    if (isIframe()) push("/");
    if (session && !isPasswordReset) push("/editor");
  }, [session, push, isPasswordReset]);

  return (
    <Layout>
      <Head>
        <title>Sign In - JSON Crack</title>
      </Head>
      <Paper mt={50} mx="auto" maw={400} p="lg" withBorder>
        <AuthenticationForm />
      </Paper>
      <Center my="xl">
        <Anchor component={Link} prefetch={false} href="/sign-up" c="dark" fw="bold">
          Don&apos;t have an account?
        </Anchor>
      </Center>
    </Layout>
  );
}
