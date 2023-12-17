import React from "react";
import { Stack, Modal, ModalProps, ScrollArea, Select } from "@mantine/core";
import { Prism } from "@mantine/prism";
import vsDark from "prism-react-renderer/themes/vsDark";
import vsLight from "prism-react-renderer/themes/vsLight";
import useJson from "src/store/useJson";

enum Language {
  TypeScript = "typescript",
  Go = "go",
}

const typeOptions = [
  {
    label: "TypeScript",
    value: Language.TypeScript,
  },
  {
    label: "Go",
    value: Language.Go,
  },
];

export const TypeModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const getJson = useJson(state => state.getJson);
  const [type, setType] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<Language>(Language.TypeScript);

  React.useEffect(() => {
    if (opened) {
      if (selectedType === Language.TypeScript) {
        import("json-to-ts").then(jts => {
          const types = jts.default(JSON.parse(getJson()));
          setType(types.flat().join("\n\n"));
        });
      } else if (selectedType === Language.Go) {
        import("src/lib/utils/json2go").then(jtg => {
          import("gofmt.js").then(gofmt => {
            const types = jtg.default(getJson());
            setType(gofmt.default(types.go));
          });
        });
      }
    }
  }, [getJson, opened, selectedType]);

  return (
    <Modal title="Generate Types" size="auto" opened={opened} onClose={onClose} centered>
      <Stack py="sm">
        <Select
          value={selectedType}
          data={typeOptions}
          onChange={e => setSelectedType(e as Language)}
        />
        <ScrollArea>
          <Prism
            miw={350}
            mah={600}
            language={selectedType}
            copyLabel="Copy to clipboard"
            copiedLabel="Copied to clipboard"
            withLineNumbers
            getPrismTheme={(_theme, colorScheme) => (colorScheme === "light" ? vsLight : vsDark)}
          >
            {type}
          </Prism>
        </ScrollArea>
      </Stack>
    </Modal>
  );
};
