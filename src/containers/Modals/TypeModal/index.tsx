import React from "react";
import { Stack, Modal, ModalProps, Select, LoadingOverlay } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import useJson from "src/store/useJson";

enum Language {
  TypeScript = "typescript",
  TypeScript_Combined = "typescript/typealias",
  Go = "go",
  JSON_SCHEMA = "json_schema",
  Kotlin = "kotlin",
  Rust = "rust",
}

const typeOptions = [
  {
    label: "TypeScript",
    value: Language.TypeScript,
    lang: "typescript",
  },
  {
    label: "TypeScript (combined)",
    value: Language.TypeScript_Combined,
    lang: "typescript",
  },
  {
    label: "Go",
    value: Language.Go,
    lang: "go",
  },
  {
    label: "JSON Schema",
    value: Language.JSON_SCHEMA,
    lang: "json",
  },
  {
    label: "Kotlin",
    value: Language.Kotlin,
    lang: "kotlin",
  },
  {
    label: "Rust",
    value: Language.Rust,
    lang: "rust",
  },
];

export const TypeModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const getJson = useJson(state => state.getJson);
  const [type, setType] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<Language>(Language.TypeScript);
  const [loading, setLoading] = React.useState(false);

  const editorLanguage = React.useMemo(() => {
    return typeOptions[typeOptions.findIndex(o => o.value === selectedType)]?.lang;
  }, [selectedType]);

  const transformer = React.useCallback(
    async ({ value }) => {
      const { run } = await import("json_typegen_wasm");
      return run(
        "Root",
        value,
        JSON.stringify({
          output_mode: selectedType,
        })
      );
    },
    [selectedType]
  );

  React.useEffect(() => {
    if (opened) {
      try {
        setLoading(true);
        if (selectedType === Language.Go) {
          import("src/lib/utils/json2go").then(jtg => {
            import("gofmt.js").then(gofmt => {
              const types = jtg.default(getJson());
              setType(gofmt.default(types.go));
            });
          });
        } else {
          transformer({ value: getJson() }).then(setType);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  }, [getJson, opened, selectedType, transformer]);

  return (
    <Modal title="Generate Types" size="md" opened={opened} onClose={onClose} centered>
      <Stack pos="relative">
        <Select
          value={selectedType}
          data={typeOptions}
          onChange={e => setSelectedType(e as Language)}
        />
        <LoadingOverlay visible={loading} />
        <CodeHighlight
          language={editorLanguage}
          copyLabel="Copy to clipboard"
          copiedLabel="Copied to clipboard"
          code={type}
        />
      </Stack>
    </Modal>
  );
};
