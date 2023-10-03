import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
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
import { Footer } from "src/layout/Footer";
import { Navbar } from "src/layout/Navbar";
import { supabase } from "src/lib/api/supabase";
import useUser from "src/store/useUser";

export function AuthenticationForm(props: PaperProps) {
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
            required
            label="Email"
            placeholder="hello@jsoncrack.com"
            value={userData.email}
            onChange={event => setUserData(d => ({ ...d, email: event.target.value }))}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="∗∗∗∗∗∗∗∗∗∗∗"
            value={userData.password}
            onChange={event => setUserData(d => ({ ...d, password: event.target.value }))}
            radius="md"
          />

          <Button color="dark" type="submit" radius="md" loading={loading}>
            Sign in
          </Button>

          <Stack spacing="sm" mx="auto" align="center">
            <Anchor
              component={Link}
              prefetch={false}
              href="/forgot-password"
              color="dark"
              size="xs"
            >
              Forgot your password?
            </Anchor>
          </Stack>
        </Stack>
      </form>

      <Divider my="lg" />

      <Stack mb="md" mt="md">
        <Button
          radius="md"
          leftIcon={<AiOutlineGoogle size="20" />}
          onClick={() => handleLoginClick("google")}
          color="red"
          variant="outline"
        >
          Sign in with Google
        </Button>
        <Button
          radius="md"
          leftIcon={<AiOutlineGithub size="20" />}
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

function ResetPassword(props: PaperProps) {
  const { query } = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query?.token && typeof query?.token === "string") {
      setLoading(true);
      supabase.auth
        .updateUser({
          password,
        })
        .then(({ error }) => {
          if (error) return toast.error(error.message);
          toast.success("Successfully updated password!");
          setTimeout(() => window.location.assign("/sign-in"), 2000);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Paper radius="md" {...props}>
      <Text size="lg" weight={500}>
        Reset Password
      </Text>

      <form onSubmit={onSubmit}>
        <Stack>
          <PasswordInput
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            label="Password"
            radius="md"
          />
          <PasswordInput
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            required
            label="Validate Password"
            radius="md"
          />
        </Stack>

        <Group position="apart" mt="xl">
          <Button type="submit" radius="xl" loading={loading}>
            Reset Password
          </Button>
        </Group>
      </form>
    </Paper>
  );
}

const SignIn = () => {
  const { isReady, push, query } = useRouter();
  const session = useSession();
  const isPasswordReset = query?.type === "recovery" && !query?.error;

  React.useEffect(() => {
    if (isReady && session && !isPasswordReset) {
      push("/editor");
    }
  }, [isReady, session, push, isPasswordReset]);

  return (
    <div>
      <Head>
        <title>Sign In - JSON Crack</title>
      </Head>
      <Navbar />
      <Paper mt={50} shadow="xs" mx="auto" maw={400} p="lg" withBorder>
        {isPasswordReset ? <ResetPassword /> : <AuthenticationForm />}
      </Paper>
      <Center my="xl">
        <Anchor component={Link} prefetch={false} href="/sign-up" color="dark" fw="bold">
          Don&apos;t have an account?
        </Anchor>
      </Center>

      <Footer />
    </div>
  );
};

export default SignIn;
