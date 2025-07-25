export enum FileFormat {
  JSON = "json",
  YAML = "yaml",
  XML = "xml",
  TOML = "toml",
  CSV = "csv",
  XLSX = "xlsx",
}

export const formats = [
  { value: FileFormat.JSON, label: "JSON" },
  { value: FileFormat.YAML, label: "YAML" },
  { value: FileFormat.XML, label: "XML" },
  { value: FileFormat.CSV, label: "CSV" },
  { value: FileFormat.XLSX, label: "XLSX" },
];

export enum TypeLanguage {
  TypeScript = "typescript",
  TypeScript_Combined = "typescript/typealias",
  Go = "go",
  JSON_SCHEMA = "json_schema",
  Kotlin = "kotlin",
  Rust = "rust",
}

export const typeOptions = [
  {
    label: "TypeScript",
    value: TypeLanguage.TypeScript,
    lang: "typescript",
  },
  {
    label: "TypeScript (merged)",
    value: TypeLanguage.TypeScript_Combined,
    lang: "typescript",
  },
  {
    label: "Go",
    value: TypeLanguage.Go,
    lang: "go",
  },
  {
    label: "JSON Schema",
    value: TypeLanguage.JSON_SCHEMA,
    lang: "json",
  },
  {
    label: "Kotlin",
    value: TypeLanguage.Kotlin,
    lang: "kotlin",
  },
  {
    label: "Rust",
    value: TypeLanguage.Rust,
    lang: "rust",
  },
];
