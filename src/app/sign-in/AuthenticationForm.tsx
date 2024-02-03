import React from "react";
import Link from "next/link";
import {
  Anchor,
  Button,
  Divider,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { toast } from "react-hot-toast";
import { AiOutlineGithub, AiOutlineGoogle } from "react-icons/ai";
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

          <Button color="dark" type="submit" radius="sm" loading={loading}>
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
