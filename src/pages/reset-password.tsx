import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";
import { PaperProps, Center, Button, Group, Paper, Stack, TextInput, Text } from "@mantine/core";
import { toast } from "react-hot-toast";
import { altogic } from "src/api/altogic";
import { Footer } from "src/layout/Footer";
import { JSONCrackLogo } from "src/layout/JsonCrackLogo";
import { Navbar } from "src/layout/Navbar";
import useUser from "src/store/useUser";

const StyledPageWrapper = styled.div`
  height: calc(100vh - 27px);
  width: 100%;

  @media only screen and (max-width: 768px) {
    position: fixed;
    height: -webkit-fill-available;
    flex-direction: column;
  }
`;

export function AuthenticationForm(props: PaperProps) {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    altogic.auth
      .sendResetPwdEmail(email)
      .then(res => {
        if (res.errors) {
          toast.error(res.errors.items[0].message);
        } else setSuccess(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Paper radius="md" p="xl" withBorder w={300} {...props}>
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
              radius="md"
            />
          </Stack>

          <Group position="apart" mt="xl">
            <Button type="submit" radius="xl" loading={loading}>
              Reset Password
            </Button>
          </Group>
        </form>
      )}
    </Paper>
  );
}

const StyledHeroSection = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const SignIn = () => {
  const { isReady, replace } = useRouter();
  const checkSession = useUser(state => state.checkSession);
  const isAuthenticated = useUser(state => state.isAuthenticated);

  React.useEffect(() => {
    if (!isReady) checkSession();
    if (isAuthenticated) replace("/");
  }, [isReady, isAuthenticated, replace, checkSession]);

  return (
    <div>
      <Head>
        <title>Reset Password | Herowand Editor</title>
      </Head>
      <Navbar />
      <StyledPageWrapper className="repeating-grid">
        <StyledHeroSection>
          <JSONCrackLogo />
        </StyledHeroSection>
        <Center pt={60}>
          <AuthenticationForm />
        </Center>
      </StyledPageWrapper>
      <Footer />
    </div>
  );
};

export default SignIn;
