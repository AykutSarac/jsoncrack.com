"use client";

import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button, Text, Title } from "@mantine/core";
import styled from "styled-components";
import Layout from "src/layout/Layout";

const StyledNotFound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 0 40px;
  text-align: center;
`;

const StyledImageWrapper = styled.div`
  width: 300px;
`;

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <Layout>
      <StyledNotFound>
        <StyledImageWrapper>
          <img src="/assets/404.svg" alt="not found" width={300} height={400} />
        </StyledImageWrapper>
        <Title c="dark">WIZARDS BEHIND CURTAINS?</Title>
        <Text c="dark">Looks like you&apos;re lost, let&apos;s head back to the home!</Text>
        <Button mt="lg" size="lg" type="button" onClick={() => redirect("/")}>
          Go Home
        </Button>
      </StyledNotFound>
    </Layout>
  );
}
