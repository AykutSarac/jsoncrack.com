import React from "react";
import { Container, Title, Accordion } from "@mantine/core";

const Questions = [
  {
    title: "What is JSON Crack and what does it do?",
    content:
      "JSON Crack is an online data visualization app capable of visualizing data formats such as JSON, YAML, XML, CSV and more, into interactive graphs. It helps you to understand, analyze and debug your data easily. JSON Crack is designed for developers, data analysts, and anyone who works with structured data formats. It's also helpful for creating documentation and presentations for your teams/customers.",
  },
  {
    title: "What kind of data formats does are supported?",
    content: "A wide range of data formats are supported including JSON, YAML, XML, CSV, and TOML.",
  },
  {
    title: "Is my data secure with JSON Crack?",
    content:
      "Absolutely! JSON Crack prioritizes your data privacy. When you paste your data into the editor, it's processed only on your device to create the visualization. Your data remains completely private and is never stored anywhere unless you choose to upload it manually.",
  },
  {
    title: "Can I customize the graph colors?",
    content:
      "Yes, you can customize the colors of the graph to match your brand or personal preferences as part of the premium plan.",
  },
  {
    title: "What size of data can I visualize?",
    content:
      "You can visualize data up to 300 KB in size with the free plan and up to 4 MB with premium plan. It might vary depending on the complexity of the data and your hardware.",
  },
  {
    title: "Can I export the generated graphs?",
    content: "Yes, you can export the generated graphs as PNG, JPEG, or SVG files.",
  },
  {
    title: "What is the difference between free and premium plans?",
    content:
      "The premium plan completely revamps the free editor, turning it into a much more powerful and efficient tool. It’s faster, more compact, and comes with a lot of extra features. Plus, you get higher data size limits and more customization options to suit your needs.",
  },
  {
    title: "I purchased a premium plan, how do I access it?",
    content:
      "After purchasing a premium plan, you should sign up with the email you used during the purchase or log in with the same email. The premium features will be automatically unlocked for you.",
  },
  {
    title: "How to use VS Code extension?",
    content:
      "You can use the VS Code extension to visualize JSON data directly in your editor. Install the extension from the VS Code marketplace and follow the instructions at extension's page.",
  },
];

export const FAQ = () => {
  return (
    <Container id="faq" component="section" mt={150}>
      <Title
        c="black"
        order={2}
        fz={{
          base: 24,
          xs: 30,
          sm: 36,
        }}
        fw={600}
        mb={60}
        ta="center"
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
