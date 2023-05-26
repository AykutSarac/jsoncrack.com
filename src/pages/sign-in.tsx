import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Center,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle, upperFirst } from "@mantine/hooks";
import { toast } from "react-hot-toast";
import { AiOutlineGithub, AiOutlineGoogle } from "react-icons/ai";
import { altogic } from "src/api/altogic";
import { Footer } from "src/layout/Footer";
import { JSONCrackLogo } from "src/layout/JsonCrackLogo";
import { Navbar } from "src/layout/Navbar";
import useUser from "src/store/useUser";

export function AuthenticationForm(props: PaperProps) {
  const login = useUser(state => state.login);
  const [loading, setLoading] = React.useState(false);
  const [type, toggle] = useToggle<"login" | "register">(["login", "register"]);
  const [done, setDone] = React.useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      passwordAgain: "",
      terms: true,
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
      altogic.auth
        .signInWithEmail(form.values.email, form.values.password)
        .then(({ user, errors }) => {
          if (errors?.items.length || !user) return toast.error("Incorrect email or password!");
          login(user as any);
        })
        .finally(() => setLoading(false));
    } else {
      altogic.auth
        .signUpWithEmail(form.values.email, form.values.password, form.values.name)
        .then(({ errors }) => {
          if (errors?.items.length) {
            return errors.items.forEach(e => toast.error(e.message));
          }
          toast.success("Registration successful!");
          setDone(true);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleLoginClick = (provider: "github" | "google") => {
    altogic.auth.signInWithProvider(provider);
  };

  if (done) {
    return (
      <Paper mih={100}>
        <Title align="center" order={2}>
          Registration successul!
          <br />
          Please check your inbox for email confirmation.
        </Title>
      </Paper>
    );
  }

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" weight={500}>
        Welcome to JSON Crack, {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <Button
          radius="xl"
          leftIcon={<AiOutlineGoogle />}
          onClick={() => handleLoginClick("google")}
          color="red"
        >
          Google
        </Button>
        <Button
          radius="xl"
          leftIcon={<AiOutlineGithub />}
          onClick={() => handleLoginClick("github")}
          color="dark"
        >
          GitHub
        </Button>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={onSubmit}>
        <Stack>
          {type === "register" && (
            <TextInput
              required
              label="Name"
              placeholder="John Doe"
              value={form.values.name}
              onChange={event => form.setFieldValue("name", event.currentTarget.value)}
              error={form.errors.name && "This field cannot be left blank"}
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@jsoncrack.com"
            value={form.values.email}
            onChange={event => form.setFieldValue("email", event.currentTarget.value)}
            error={form.errors.email && "Invalid email"}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={event => form.setFieldValue("password", event.currentTarget.value)}
            error={form.errors.password && "Password should include at least 6 characters"}
            radius="md"
          />
          {type === "login" && (
            <Link href="/reset-password">
              <Text size="xs">Forgot password?</Text>
            </Link>
          )}

          {type === "register" && (
            <PasswordInput
              required
              label="Validate Password"
              placeholder="Your password"
              value={form.values.passwordAgain}
              onChange={event => form.setFieldValue("passwordAgain", event.currentTarget.value)}
              error={form.errors.passwordAgain && "Passwords doesn't match"}
              radius="md"
            />
          )}

          {type === "register" && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={event => form.setFieldValue("terms", event.currentTarget.checked)}
            />
          )}
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => toggle()}
            size="xs"
          >
            {type === "register"
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl" loading={loading} disabled={!form.values.terms}>
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}

const StyledPageWrapper = styled.div`
  padding: 5%;
`;

const StyledHeroSection = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

function ResetPassword(props: PaperProps) {
  const { query } = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query?.access_token && typeof query?.access_token === "string") {
      setLoading(true);
      altogic.auth
        .resetPwdWithToken(query?.access_token, password)
        .then(({ errors }) => {
          if (errors) {
            toast.error(errors.items[0].message);
          } else {
            toast.success("Successfully updated password!");
            setTimeout(() => window.location.assign("/sign-in"), 2000);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder w={300} {...props}>
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
  const { isReady, replace, push, query } = useRouter();
  const checkSession = useUser(state => state.checkSession);
  const isAuthenticated = useUser(state => state.isAuthenticated);
  const isPasswordReset = query?.action === "reset-pwd" && !query?.error;

  const isAuthenticating = React.useMemo(() => {
    if (query?.action === "oauth-signin" && query?.status === "200") return true;
    return false;
  }, [query]);

  React.useEffect(() => {
    if (isAuthenticated) push("/editor");
  }, [isReady, isAuthenticated, push]);

  return (
    <div>
      <Head>
        <title>Sign In | Herowand Editor</title>
      </Head>
      <Navbar />
      <StyledPageWrapper className="repeating-grid">
        <StyledHeroSection>
          <JSONCrackLogo />
        </StyledHeroSection>
        {isAuthenticating ? (
          <Center>
            <Stack my={60} w={250} spacing="xl">
              <Button size="lg" color="orange" onClick={checkSession}>
                JSON Crack
              </Button>
              <Button
                component="a"
                href={window.location.href.replace(window.location.host, "editor.herowand.com")}
                size="lg"
                color="teal"
              >
                Herowand Editor
              </Button>
            </Stack>
          </Center>
        ) : (
          <Center pt={60}>{isPasswordReset ? <ResetPassword /> : <AuthenticationForm />}</Center>
        )}
      </StyledPageWrapper>
      <Footer />
    </div>
  );
};

export default SignIn;
