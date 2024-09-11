import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Stack,
  Center,
  Text,
  FocusTrap,
  Alert,
  Box,
  Flex,
} from "@mantine/core";
import { NextSeo } from "next-seo";
import { AiOutlineGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { MdErrorOutline } from "react-icons/md";
import { SEO } from "src/constants/seo";
import { AuthLayout } from "src/layout/AuthLayout";
import { supabase } from "src/lib/api/supabase";
import useUser from "src/store/useUser";

export function AuthenticationForm() {
  const { push } = useRouter();
  const setSession = useUser(state => state.setSession);
  const isAuthenticated = useUser(state => state.isAuthenticated);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [userData, setUserData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password,
    });

    if (error) {
      setLoading(false);
      return setErrorMessage("Incorrect email or password.");
    }

    setSession(data.session);
    push("/editor");
  };

  const handleLoginClick = async (provider: "github" | "google") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/oauth` },
    });
  };

  if (isAuthenticated) {
    return (
      <Box mt="lg">
        <Text fz="sm" c="dark">
          You are already signed in. Click the button below to go to the editor.
        </Text>
        <Link href="/editor">
          <Button mt="lg" color="dark" size="md" radius="md" fullWidth>
            Go to Editor
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box>
      {errorMessage && (
        <Alert
          onClose={() => setErrorMessage(null)}
          color="red"
          py="xs"
          mb="lg"
          icon={<MdErrorOutline color="red" />}
          withCloseButton
        >
          <Text fz="sm" c="red">
            {errorMessage}
          </Text>
        </Alert>
      )}
      <FocusTrap>
        <form onSubmit={onSubmit}>
          <Stack>
            <TextInput
              name="email"
              type="email"
              required
              label="Email"
              placeholder="hello@jsoncrack.com"
              value={userData.email}
              onChange={event => setUserData(d => ({ ...d, email: event.target.value }))}
              radius="sm"
              style={{ color: "black" }}
              withAsterisk={false}
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
              withAsterisk={false}
            />

            <Anchor
              component={Link}
              prefetch={false}
              href="/forgot-password"
              c="dimmed"
              size="xs"
              ta="right"
              mt="-sm"
            >
              Forgot password?
            </Anchor>
            <Button color="dark" type="submit" radius="sm" loading={loading}>
              Sign in
            </Button>
          </Stack>
        </form>
      </FocusTrap>

      <Flex mt="lg" gap="sm">
        <Button
          radius="sm"
          fullWidth
          leftSection={<FcGoogle size="20" />}
          onClick={() => handleLoginClick("google")}
          variant="default"
          disabled={loading}
        >
          Google
        </Button>
        <Button
          radius="sm"
          leftSection={<AiOutlineGithub size="20" />}
          onClick={() => handleLoginClick("github")}
          variant="default"
          fullWidth
          disabled={loading}
        >
          GitHub
        </Button>
      </Flex>
    </Box>
  );
}

const SignIn = () => {
  const { push, query, pathname } = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) return console.error(error);
      if (!data.session) return;
      push("/editor");
    });
  }, [pathname, push, query.code]);

  return (
    <AuthLayout>
      <NextSeo
        {...SEO}
        title="Sign In - JSON Crack"
        description="Sign in to your JSON Crack account to create and edit diagrams with ease."
        canonical="https://jsoncrack.com/sign-in"
      />
      <AuthenticationForm />
      <Center mt={80}>
        <Anchor component={Link} prefetch={false} href="/sign-up" c="dark" fz="sm">
          Don&apos;t have an account?
          <Text component="span" fz="sm" c="blue" ml={4}>
            Sign up
          </Text>
        </Anchor>
      </Center>
    </AuthLayout>
  );
};

export default SignIn;
