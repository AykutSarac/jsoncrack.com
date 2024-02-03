"use client";

import React from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Anchor,
  Button,
  Center,
  Divider,
  Flex,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import toast from "react-hot-toast";
import { AiOutlineGithub, AiOutlineGoogle } from "react-icons/ai";
import Layout from "src/layout/Layout";
import { supabase } from "src/lib/api/supabase";

export default function Page() {
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [userData, setUserData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    supabase.auth
      .signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: { name: userData.name },
        },
      })
      .then(({ error }) => {
        if (error) return toast.error(error.message);
        toast.success("Please check your inbox to confirm mail address!", { duration: 7000 });
        setDone(true);
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
    <Layout>
      <Head>
        <title>JSON Crack | Sign Up</title>
      </Head>
      {done ? (
        <Paper mx="auto" maw={400} mt={50} p="lg" withBorder>
          <Text mt="lg" style={{ textAlign: "center" }}>
            Registration successul!
            <br />
            Please check your inbox for email confirmation.
          </Text>
          <Anchor component={Link} href="/sign-in">
            <Button color="dark" radius="sm" mt="lg" fullWidth>
              Back to login
            </Button>
          </Anchor>
        </Paper>
      ) : (
        <>
          <Paper mx="auto" maw={400} mt={50} p="lg" withBorder>
            <form onSubmit={onSubmit}>
              <Stack>
                <TextInput
                  onChange={e => setUserData(d => ({ ...d, name: e.target.value }))}
                  required
                  label="Name"
                  placeholder="John Doe"
                  radius="sm"
                  style={{ color: "black" }}
                />

                <TextInput
                  onChange={e => setUserData(d => ({ ...d, email: e.target.value }))}
                  type="email"
                  required
                  label="Email"
                  placeholder="hello@jsoncrack.com"
                  radius="sm"
                  style={{ color: "black" }}
                />

                <PasswordInput
                  onChange={e => setUserData(d => ({ ...d, password: e.target.value }))}
                  min={6}
                  required
                  label="Password"
                  placeholder="∗∗∗∗∗∗∗∗∗∗"
                  radius="sm"
                  style={{ color: "black" }}
                />

                <Button color="dark" type="submit" loading={loading}>
                  Sign up for free
                </Button>

                <Divider label="OR CONTINUE WITH" labelPosition="center" />

                <Flex gap="sm">
                  <Button
                    radius="sm"
                    fullWidth
                    leftSection={<AiOutlineGoogle size="20" />}
                    onClick={() => handleLoginClick("google")}
                    color="red"
                    variant="outline"
                  >
                    Google
                  </Button>
                  <Button
                    radius="sm"
                    leftSection={<AiOutlineGithub size="20" />}
                    onClick={() => handleLoginClick("github")}
                    color="dark"
                    variant="outline"
                    fullWidth
                    loading={loading}
                  >
                    GitHub
                  </Button>
                </Flex>

                <Divider mx={-20} />

                <Text fz="xs" c="gray">
                  By signing up, you agree to our{" "}
                  <Anchor fz="xs" component={Link} href="/legal/terms" c="gray" fw={500}>
                    Terms of Service
                  </Anchor>{" "}
                  and{" "}
                  <Anchor fz="xs" component={Link} href="/legal/privacy" c="gray" fw={500}>
                    Privacy Policy
                  </Anchor>
                  . Need help?{" "}
                  <Anchor
                    fz="xs"
                    component={Link}
                    href="mailto:contact@jsoncrack.com"
                    c="gray"
                    fw={500}
                  >
                    Get in touch.
                  </Anchor>
                </Text>
              </Stack>
            </form>
          </Paper>

          <Center my="xl">
            <Anchor component={Link} prefetch={false} href="/sign-in" c="dark" fw="bold">
              Already have an account?
            </Anchor>
          </Center>
        </>
      )}
    </Layout>
  );
}
