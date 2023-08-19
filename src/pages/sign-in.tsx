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
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle, upperFirst } from "@mantine/hooks";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { AiOutlineGithub, AiOutlineGoogle } from "react-icons/ai";
import { Footer } from "src/layout/Footer";
import { JSONCrackLogo } from "src/layout/JsonCrackLogo";
import { Navbar } from "src/layout/Navbar";
import { supabase } from "src/lib/api/supabase";
import useUser from "src/store/useUser";

export function AuthenticationForm(props: PaperProps) {
  const setSession = useUser(state => state.setSession);
  const [loading, setLoading] = React.useState(false);
  const [type, toggle] = useToggle<"login" | "register">(["login", "register"]);
  const [done, setDone] = React.useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      passwordAgain: "",
    },

    validate: {
      email: val => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: val => (val.length <= 6 ? "Password should include at least 6 characters" : null),
      passwordAgain: (val, { password }) =>
        type === "register" && val !== password ? "Passwords doesn't match" : null,
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validate = form.validate();

    if (validate.hasErrors) return;

    setLoading(true);
    if (type === "login") {
      supabase.auth
        .signInWithPassword({
          email: form.values.email,
          password: form.values.password,
        })
        .then(({ data, error }) => {
          if (error) return toast.error(error.message);
          setSession(data.session);
        })
        .finally(() => setLoading(false));
    } else {
      supabase.auth
        .signUp({
          email: form.values.email,
          password: form.values.password,
          options: {
            data: { name: form.values.name },
          },
        })
        .then(({ error }) => {
          if (error) return toast.error(error.message);
          toast.success("Please check your inbox to confirm mail address!", { duration: 7000 });
          setDone(true);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleLoginClick = (provider: "github" | "google") => {
    supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: "https://jsoncrack.com/editor" },
    });
  };

  if (done) {
    return (
      <Paper mih={100}>
        <Text align="center" mt="lg">
          Registration successul!
          <br />
          Please check your inbox for email confirmation.
        </Text>
        <Button radius="sm" size="md" mt="lg" onClick={() => window.location.reload()} fullWidth>
          Back to login
        </Button>
      </Paper>
    );
  }

  return (
    <Paper {...props}>
      <Stack mb="md" mt="md">
        <Button
          radius="sm"
          size="md"
          leftIcon={<AiOutlineGoogle size="20" />}
          onClick={() => handleLoginClick("google")}
          color="red"
          variant="outline"
        >
          Sign In with Google
        </Button>
        <Button
          radius="sm"
          size="md"
          leftIcon={<AiOutlineGithub size="20" />}
          onClick={() => handleLoginClick("github")}
          color="dark"
          variant="outline"
        >
          Sign In with GitHub
        </Button>
      </Stack>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={onSubmit}>
        <Stack>
          {type === "register" && (
            <TextInput
              required
              size="md"
              label="Name"
              placeholder="John Doe"
              value={form.values.name}
              onChange={event => form.setFieldValue("name", event.currentTarget.value)}
              error={form.errors.name && "This field cannot be left blank"}
              radius="sm"
            />
          )}

          <TextInput
            required
            label="Email address"
            size="md"
            placeholder="hello@jsoncrack.com"
            value={form.values.email}
            onChange={event => form.setFieldValue("email", event.currentTarget.value)}
            error={form.errors.email && "Invalid email"}
            radius="sm"
          />

          <PasswordInput
            required
            label="Your Password"
            size="md"
            placeholder="*********"
            value={form.values.password}
            onChange={event => form.setFieldValue("password", event.currentTarget.value)}
            error={form.errors.password && "Password should include at least 6 characters"}
            radius="sm"
          />

          {type === "register" && (
            <PasswordInput
              required
              label="Validate Password"
              placeholder="Your password"
              value={form.values.passwordAgain}
              onChange={event => form.setFieldValue("passwordAgain", event.currentTarget.value)}
              error={form.errors.passwordAgain && "Passwords doesn't match"}
              radius="sm"
              size="md"
            />
          )}

          <Button type="submit" radius="sm" size="md" loading={loading}>
            {upperFirst(type)}
          </Button>

          <Stack spacing="sm" mx="auto" align="center">
            {type === "login" && (
              <Anchor
                component={Link}
                prefetch={false}
                href="/reset-password"
                color="dark"
                size="xs"
              >
                Forgot your password?
              </Anchor>
            )}
            <Anchor
              color="dark"
              component="button"
              type="button"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </Anchor>
          </Stack>
        </Stack>
      </form>
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
    <Paper radius="sm" {...props}>
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
            radius="sm"
          />
          <PasswordInput
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            required
            label="Validate Password"
            radius="sm"
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
  const [alertVisible, setAlertVisible] = React.useState(true);

  React.useEffect(() => {
    if (session) push("/editor");
  }, [isReady, session, push]);

  return (
    <div>
      <Head>
        <title>Sign In | JSON Crack</title>
      </Head>
      <Navbar />
      {alertVisible && (
        <Alert
          color="orange"
          radius="md"
          mt={30}
          mx="auto"
          w={700}
          variant="outline"
          withCloseButton
          onClose={() => setAlertVisible(false)}
        >
          We have transitioned to a new database. If you&apos;ve been using JSON Crack for a while
          and unable to login, kindly <strong>register a new account</strong> once more. (Rest
          assured, your saved files remain intact.)
        </Alert>
      )}

      <Paper shadow="md" mx="auto" maw={400} mt={50} p="lg" withBorder>
        <JSONCrackLogo />
        {isPasswordReset ? <ResetPassword /> : <AuthenticationForm />}
      </Paper>
      <Footer />
    </div>
  );
};

export default SignIn;
