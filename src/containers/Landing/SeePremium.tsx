import React from "react";
import { Title, Image, Flex, Box, Button, Text, Paper, Container } from "@mantine/core";
import styled from "styled-components";
import { FaArrowRightLong } from "react-icons/fa6";

const StyledImageWrapper = styled.div`
  margin: 0 -30px -30px;
  padding-left: 30px;
  padding-top: 30px;
`;

export const SeePremium = () => {
  return (
    <Container size="xl">
      <Paper
        py={12}
        px={30}
        bg="#202842"
        id="premium"
        component="section"
        w="100%"
        style={{
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <Flex gap="lg" align="center">
          <Box flex="1.3">
            <Flex align="center" gap="xs" mb="md">
              <Image
                src="https://todiagram.com/logo.svg"
                alt="Todiagram Logo"
                h={20}
                w="fit-content"
                loading="eager"
              />
              <Title fz="20" fw="500" c="gray.2">
                Upgrade to ToDiagram
              </Title>
            </Flex>

            <Text c="gray.4" fz="h3" mb="xl" maw={410}>
              Larger uploads, faster loading, beautiful diagrams and advanced tools.
            </Text>
            <Button
              component="a"
              href="https://todiagram.com"
              display="block"
              w="fit-content"
              miw={200}
              color="#fe5e49"
              size="md"
              mt="xl"
              rightSection={<FaArrowRightLong />}
              radius="xl"
              rel="noopener"
            >
              Upgrade
            </Button>
          </Box>

          <Box visibleFrom="xs">
            <StyledImageWrapper>
              <Image
                mah="200"
                w="100%"
                loading="lazy"
                src="https://todiagram.com/images/landing/editor.webp"
                alt="ToDiagram Editor"
              />
            </StyledImageWrapper>
          </Box>
        </Flex>
      </Paper>
    </Container>
  );
};
