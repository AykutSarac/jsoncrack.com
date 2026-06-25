export const SCHEMA_INPUT = `{
  "fruits": ["apple", "banana", "cherry"]
}`;

export const CONFLICTING_SCHEMA = `{
  "type": "object",
  "properties": {
    "fruits": { "type": "string" }
  }
}`;
