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
