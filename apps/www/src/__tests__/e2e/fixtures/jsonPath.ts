// Fixture for the JSON Path e2e test (json-path.e2e.ts).
//
// JSON_PATH_INPUT is pasted into the editor, JSON_PATH_QUERY is run from
// Tools → JSON Path, and JSON_PATH_EXPECTED is the exact editor content the
// JPathModal writes back afterwards: JSON.stringify(result, null, 2), where the
// result is the JSONPath match array ["Tony", "Steve", "Natasha"].

export const JSON_PATH_INPUT = `{
  "team": "Avengers",
  "members": [
    { "name": "Tony", "role": "Iron Man" },
    { "name": "Steve", "role": "Captain America" },
    { "name": "Natasha", "role": "Black Widow" }
  ]
}`;

export const JSON_PATH_QUERY = "$.members[*].name";

export const JSON_PATH_EXPECTED = `[
  "Tony",
  "Steve",
  "Natasha"
]`;
