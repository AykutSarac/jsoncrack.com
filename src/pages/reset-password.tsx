import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { PaperProps, Button, Group, Paper, Stack, TextInput, Text, Anchor } from "@mantine/core";
import { useSession } from "@supabase/auth-helpers-react";
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
      .resetPasswordForEmail(email, { redirectTo: "/reset-password" })
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
            <Anchor component={Link} href="/sign-in" color="dark" size="xs">
              Don&apos;t have an account? Sign Up
            </Anchor>
          </Stack>
        </form>
      )}
    </Paper>
  );
}

const SignIn = () => {
  const { isReady, push } = useRouter();
  const session = useSession();

  React.useEffect(() => {
    if (session) push("/editor");
  }, [isReady, session, push]);

  return (
    <div>
      <Head>
        <title>Reset Password | JSON Crack</title>
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

export default SignIn;
