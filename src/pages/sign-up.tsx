import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Anchor, Button, Center, Text } from "@mantine/core";
import { NextSeo } from "next-seo";
import { SEO } from "src/constants/seo";
import { AuthLayout } from "src/layout/AuthLayout";
import { supabase } from "src/lib/api/supabase";

const SignUp = () => {
  const { push } = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) push("/editor");
    });
  }, [push]);

  return (
    <AuthLayout>
      <NextSeo
        {...SEO}
        title="Sign Up - JSON Crack"
        description="Create an account to start creating graphs and visualizing your data."
        canonical="https://jsoncrack.com/sign-up"
      />
      <Text fw={500}>JSON Crack is no longer accepting new sign-ups.</Text>
      <Text fz="sm" mt="md" c="gray.6">
        For advanced features, please visit{" "}
        <Anchor td="underline" href="https://todiagram.com" inherit>
          ToDiagram
        </Anchor>
        , or you can continue using JSON Crack without an account.
      </Text>
      <Center my="md">
        <Link href="/editor" prefetch={false} passHref>
          <Button size="md" color="dark" radius="md">
            Go to editor
          </Button>
        </Link>
      </Center>
      <Center mt={50}>
        <Anchor component={Link} prefetch={false} href="/sign-in" c="dark" fz="sm">
          Already have an account?
          <Text component="span" fz="sm" c="blue" ml={4}>
            Sign in
          </Text>
        </Anchor>
      </Center>
    </AuthLayout>
  );
};

export default SignUp;
