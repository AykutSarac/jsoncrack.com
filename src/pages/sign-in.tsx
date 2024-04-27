import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
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
  Text,
} from "@mantine/core";
import { toast } from "react-hot-toast";
import { AiOutlineGithub, AiOutlineGoogle } from "react-icons/ai";
import Layout from "src/layout/Layout";
import { supabase } from "src/lib/api/supabase";
import { isIframe } from "src/lib/utils/widget";
import useUser from "src/store/useUser";

export function AuthenticationForm(props: PaperProps) {
  const { push } = useRouter();
  const setSession = useUser(state => state.setSession);
  const isAuthenticated = useUser(state => state.isAuthenticated);
  const [sessionLoading, setSessionLoading] = React.useState(false);
  const [userData, setUserData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSessionLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password,
    });

    if (error) {
      setSessionLoading(false);
      return toast.error(error.message);
    }

    await setSession(data.session);
    push("/editor");
    setSessionLoading(false);
  };

  const handleLoginClick = async (provider: "github" | "google") => {
    setSessionLoading(true);
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/editor` },
    });
    setSessionLoading(false);
  };

  if (isAuthenticated) {
    return (
      <Paper p="lg" maw={400} style={{ textAlign: "center" }}>
        <Text fz="sm" c="dark">
          You are already signed in. Click the button below to go to the editor.
        </Text>
        <Link href="/editor">
          <Button mt="lg" color="dark" size="lg">
            GO TO EDITOR
          </Button>
        </Link>
      </Paper>
    );
  }

  return (
    <Paper {...props} style={{ textAlign: "left" }}>
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

          <Button color="dark" type="submit" radius="sm" loading={sessionLoading}>
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

const SignIn = () => {
  const { isReady, push, query } = useRouter();
  const hasSession = useUser(state => !!state.user);
  const setSession = useUser(state => state.setSession);
  const isPasswordReset = query?.type === "recovery" && !query?.error;

  React.useEffect(() => {
    if (isIframe()) {
      push("/");
      return;
    }

    if (!isReady) return;

    if (query?.access_token && query?.refresh_token) {
      (async () => {
        const { data, error } = await supabase.auth.setSession({
          access_token: query.access_token as string,
          refresh_token: query.refresh_token as string,
        });

        if (error) return toast.error(error.message);
        if (data.session) setSession(data.session);
      })();
    }

    if (hasSession && !isPasswordReset) push("/editor");
  }, [isReady, hasSession, push, isPasswordReset, query, setSession]);

  if (!isReady) return null;

  return (
    <Layout>
      <Head>
        <title>Sign In - JSON Crack</title>
        <link rel="canonical" href="https://app.jsoncrack.com/sign-in" />
      </Head>
      <Paper mt={100} mx="auto" maw={400} p="lg" withBorder>
        <AuthenticationForm />
      </Paper>
      <Center my="xl">
        <Anchor component={Link} prefetch={false} href="/sign-up" c="gray.5" fw="bold">
          Don&apos;t have an account?
        </Anchor>
      </Center>
    </Layout>
  );
};

export default SignIn;
