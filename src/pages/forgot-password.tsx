import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Button,
  Group,
  Stack,
  TextInput,
  Text,
  Anchor,
  PasswordInput,
  Title,
  FocusTrap,
  Alert,
} from "@mantine/core";
import { NextSeo } from "next-seo";
import { MdErrorOutline } from "react-icons/md";
import { SEO } from "src/constants/seo";
import { AuthLayout } from "src/layout/AuthLayout";
import { supabase } from "src/lib/api/supabase";

function ResetPassword() {
  const { push } = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);

      if (password !== password2) throw new Error("Passwords do not match");

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw new Error(error.message);

      setSuccess(true);
      push("/sign-in");
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Text>
        Password updated successfully.{" "}
        <Anchor component={Link} href="/sign-in">
          Sign in
        </Anchor>
      </Text>
    );
  }

  return (
    <FocusTrap>
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
            autoComplete="new-password"
            data-autofocus
          />
          <PasswordInput
            name="password"
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            required
            label="Confirm Password"
            autoComplete="new-password"
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
      <Stack mt="lg" align="center">
        <Anchor component={Link} prefetch={false} href="/sign-up" c="dark" fz="sm">
          Don&apos;t have an account?
          <Text component="span" fz="sm" c="blue" ml={4}>
            Sign up
          </Text>
        </Anchor>
      </Stack>
    </FocusTrap>
  );
}

const ForgotPassword = () => {
  const { query } = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const isPasswordReset = query?.type === "recovery" && !query?.error;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password`,
      });
      if (error) throw new Error(error.message);

      setSuccess(true);
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <NextSeo
        {...SEO}
        title="Reset Password - JSON Crack"
        noindex
        nofollow
        canonical="https://jsoncrack.com/forgot-password"
      />
      <Title c="dark.4" order={2} fz="xl" mb={25} fw={600}>
        {isPasswordReset ? "Create New Password" : "Forgot Password"}
      </Title>
      {isPasswordReset ? (
        <ResetPassword />
      ) : (
        <>
          {success ? (
            <>
              <Text>We&apos;ve sent an email to you, please check your inbox.</Text>
              <Button component={Link} href="/sign-in" color="dark" radius="sm" mt="lg" fullWidth>
                Back to Login
              </Button>
            </>
          ) : (
            <form onSubmit={onSubmit}>
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
                    data-autofocus
                  />
                </Stack>
              </FocusTrap>

              <Group justify="apart" mt="md">
                <Button color="dark" type="submit" radius="sm" loading={loading} fullWidth>
                  Reset Password
                </Button>
              </Group>
            </form>
          )}
          <Stack mt="lg" align="center">
            <Anchor component={Link} prefetch={false} href="/sign-up" c="dark" fz="sm">
              Don&apos;t have an account?
              <Text component="span" fz="sm" c="blue" ml={4}>
                Sign up
              </Text>
            </Anchor>
          </Stack>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
