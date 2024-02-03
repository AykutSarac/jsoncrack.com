"use client";

import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Paper, Anchor, Center } from "@mantine/core";
import { useSession } from "@supabase/auth-helpers-react";
import Layout from "src/layout/Layout";
import { isIframe } from "src/lib/utils/widget";
import { AuthenticationForm } from "./AuthenticationForm";

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
