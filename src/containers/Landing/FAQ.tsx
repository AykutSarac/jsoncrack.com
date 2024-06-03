import React from "react";
import { Container, Title, Accordion, Text, List, Anchor } from "@mantine/core";

const Questions = [
  {
    title: "What is JSON Crack?",
    content:
      "JSON Crack is a data visualization app capable of visualizing data formats such as JSON, YAML, XML, CSV and more, into interactive graphs. It helps you to understand, analyze and debug your data easily. JSON Crack is designed for developers, data analysts, and anyone who works with structured data formats. It's also helpful for creating documentation and presentations for your teams/customers.",
  },
  {
    title: "Who is it for and what are the use-cases?",
    content:
      "JSON Crack is for developers, data analysts, and anyone who works with data. It's useful for visualizing data structures, debugging, and understanding complex data. It's also helpful for creating documentation and presentations for your teams/customers.",
  },
  {
    title: "Do you see my data pasted on the editor?",
    content:
      "No, JSON Crack does not store your data anywhere unless you upload it manually. When you paste your data into the editor, it's processed on your device only to create the visualization. Your data remains completely private.",
  },
  {
    title: "What are the advantages of the premium plan?",
    content: (
      <>
        The key features are:
        <List mt="lg">
          <List.Item>Expanded support for larger datasets</List.Item>
          <List.Item>Compare data on graphs</List.Item>
          <List.Item>Compact visualization style: see only what you need to</List.Item>
          <List.Item>Searching is faster and smoother</List.Item>
          <List.Item>Ask AI to filter your data</List.Item>
          <List.Item>Direct data editing on the graphs & tree view</List.Item>
        </List>
        <Text mt="sm" inherit>
          You may visit the <Anchor href="#pricing">pricing page</Anchor> for more details.
        </Text>
      </>
    ),
  },
];

export const FAQ = () => {
  return (
    <Container id="faq" component="section">
      <Title
        c="black"
        order={2}
        fz={{
          sm: 32,
          md: 42,
        }}
        fw={600}
        mt={150}
        mb={60}
        style={{ textAlign: "center" }}
      >
        Frequently Asked Questions
      </Title>
      <Accordion
        variant="separated"
        styles={{
          panel: {
            background: "#f9f9f9",
            color: "#1d1d1d",
          },
          label: {
            color: "#1d1d1d",
            fontWeight: 500,
          },
          item: {
            background: "#f9f9f9",
            color: "#1d1d1d",
            overflow: "hidden",
            border: "1px solid #ededed",
            borderRadius: 12,
            fontWeight: 300,
          },
        }}
      >
        {Questions.map(({ title, content }) => (
          <Accordion.Item key={title} value={title}>
            <Accordion.Control>{title}</Accordion.Control>
            <Accordion.Panel>{content}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};
