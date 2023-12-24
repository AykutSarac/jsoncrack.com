import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Button, Text, Title } from "@mantine/core";
import Layout from "src/layout/Layout";

const StyledNotFound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 0 40px;
  text-align: center;
`;

const StyledMessage = styled.h4`
  color: ${({ theme }) => theme.FULL_WHITE};
  font-size: 25px;
  font-weight: 800;
  margin: 10px 0;
`;

const StyledSubMessage = styled.div`
  width: 50%;
  color: ${({ theme }) => theme.SILVER};
  margin-bottom: 25px;
`;

const StyledImageWrapper = styled.div`
  width: 300px;
`;

const NotFound: React.FC = () => {
  const router = useRouter();

  return (
    <Layout>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <StyledNotFound>
        <StyledImageWrapper>
          <img src="/assets/404.svg" alt="not found" width={300} height={400} />
        </StyledImageWrapper>
        <Title c="dark">WIZARDS BEHIND CURTAINS?</Title>
        <Text c="dark">Looks like you&apos;re lost, let&apos;s head back to the home!</Text>
        <Button mt="lg" size="lg" type="button" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </StyledNotFound>
    </Layout>
  );
};

export default NotFound;
