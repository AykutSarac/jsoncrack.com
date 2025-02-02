import React from "react";
import Link from "next/link";
import { Anchor, Button, Flex, List, SimpleGrid, Stack } from "@mantine/core";
import { FaArrowRightLong } from "react-icons/fa6";
import { formats } from "../../enums/file.enum";

const languages = formats.map(format => format.label);

function groupCombinations(array: string[]): Record<string, string[]> {
  // Create an object to hold the grouped combinations
  const grouped = {};

  // Iterate over each item in the array
  array.forEach(from => {
    // Filter out the same item for the "to" array
    const targets = array.filter(to => to !== from);

    // Add the "from" item as the key and the "to" items as the value array
    grouped[from] = targets;
  });

  return grouped;
}

const groupedLanguages = groupCombinations(languages);

export const PageLinks = () => {
  return (
    <Flex justify="space-between" align="center">
      <Stack gap="sm" py="md" justify="center">
        <Button
          component={Link}
          prefetch={false}
          href="/editor"
          radius="md"
          size="sm"
          color="dark.5"
          autoContrast
          w="fit-content"
          rightSection={<FaArrowRightLong />}
          style={{
            boxShadow: "rgba(0, 0, 0, 0.12) 0px -3px 0px 0px inset",
            border: "none",
          }}
        >
          Open JSON Crack
        </Button>
      </Stack>
      <SimpleGrid cols={4} w="fit-content">
        {Object.entries(groupedLanguages).map(([from, tos]) => (
          <List key={from} listStyleType="none">
            {tos.map(to => (
              <List.Item key={to} c="black">
                <Anchor
                  component={Link}
                  prefetch={false}
                  c="black"
                  href={`/converter/${from.toLowerCase()}-to-${to.toLowerCase()}`}
                >
                  {from} to {to}
                </Anchor>
              </List.Item>
            ))}
          </List>
        ))}
      </SimpleGrid>
    </Flex>
  );
};
