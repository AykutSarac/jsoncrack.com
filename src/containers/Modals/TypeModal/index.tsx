import React from "react";
import { Stack, Modal, ModalProps, ScrollArea, Select } from "@mantine/core";
import { Prism } from "@mantine/prism";
import vsDark from "prism-react-renderer/themes/vsDark";
import vsLight from "prism-react-renderer/themes/vsLight";
import useJsonQuery from "src/hooks/useJsonQuery";

const typeOptions = [
  {
    label: "TypeScript",
    value: "typescript",
  },
];

export const TypeModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const { getJsonType } = useJsonQuery();
  const [type, setType] = React.useState("");

  React.useEffect(() => {
    if (opened) {
      setType(getJsonType());
    }
  }, [getJsonType, opened]);

  return (
    <Modal title="Generate Types" size="auto" opened={opened} onClose={onClose} centered>
      <Stack py="sm">
        <Select value="typescript" data={typeOptions} />
        <ScrollArea>
          <Prism
            miw={350}
            mah={600}
            language="typescript"
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
