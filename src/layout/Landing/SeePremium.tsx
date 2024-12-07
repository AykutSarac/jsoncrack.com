import React from "react";
import {
  Title,
  Image,
  Flex,
  Box,
  Button,
  Text,
  Paper,
  Container,
  Mark,
  Avatar,
  Rating,
  Stack,
} from "@mantine/core";
import styled from "styled-components";
import { FaArrowRightLong } from "react-icons/fa6";

const StyledImageWrapper = styled.div`
  margin: 0 -30px -30px;
  padding-left: 30px;
  padding-top: 30px;
`;

export const SeePremium = () => {
  return (
    <Container size="sm">
      <Paper
        py={20}
        px={30}
        bg="#2a954a"
        id="premium"
        component="section"
        w="100%"
        style={{
          borderRadius: 12,
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
              <Title fz="20" fw="600" c="white">
                Upgrade to{" "}
                <Mark color="yellow.5" px="4" py="2" style={{ borderRadius: 4 }}>
                  ToDiagram
                </Mark>
              </Title>
            </Flex>

            <Text c="gray.1" mb="sm" maw={410}>
              Try out the premium features of ToDiagram and create beautiful diagrams with ease.
            </Text>
            <Flex align="center" gap="sm">
              <Avatar.Group>
                <Avatar src="https://todiagram.com/images/landing/user-1.webp" alt="user" />
                <Avatar src="https://todiagram.com/images/landing/user-2.webp" alt="user" />
                <Avatar src="https://todiagram.com/images/landing/user-3.webp" alt="user" />
              </Avatar.Group>
              <Stack gap="0">
                <Rating color="yellow.5" value={5} readOnly />
                <Text c="white" fz="sm">
                  Loved by 400+ users
                </Text>
              </Stack>
            </Flex>
            <Button
              component="a"
              href="https://todiagram.com"
              display="block"
              w="fit-content"
              miw={200}
              color="yellow.5"
              size="md"
              mt="xl"
              rightSection={<FaArrowRightLong />}
              radius="xl"
              rel="noopener"
            >
              Upgrade
            </Button>
          </Box>

          <Box visibleFrom="xs" style={{ alignSelf: "end" }}>
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
