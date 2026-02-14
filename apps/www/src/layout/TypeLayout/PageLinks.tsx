import React from "react";
import Link from "next/link";
import { Anchor, Button, Flex, List, SimpleGrid, Stack } from "@mantine/core";
import { FaArrowRightLong } from "react-icons/fa6";
import { formats, TypeLanguage, typeOptions } from "../../enums/file.enum";

type MappedCombinations = {
  [language: string]: string[]; // Maps each language to an array of programming languages
};

function mapLanguagesToProgramming(
  languages: string[],
  programmingLanguages: string[]
): MappedCombinations {
  const mappedCombinations: MappedCombinations = {};

  // Iterate over each language
  languages.forEach(language => {
    // Assign the array of programming languages to each language key
    mappedCombinations[language] = programmingLanguages;
  });

  return mappedCombinations;
}

const filterProgrammingLanguages = [TypeLanguage.TypeScript_Combined, TypeLanguage.JSON_SCHEMA];

const languages = formats.map(format => format.label);

const programmingLanguages = typeOptions
  .filter(option => !filterProgrammingLanguages.includes(option.value))
  .map(option => option.label);

const groupedLanguages = mapLanguagesToProgramming(languages, programmingLanguages);

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
                  href={`/type/${from.toLowerCase()}-to-${to.toLowerCase()}`}
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
