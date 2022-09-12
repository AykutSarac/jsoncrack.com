export const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// Example taken from https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json
const sampleJson = Object.freeze({
  squadName: "Super hero squad",
  homeTown: "Metro City",
  formed: 2016,
  secretBase: "Super tower",
  active: true,
  members: [
    {
      name: "Molecule Man",
      age: 29,
      secretIdentity: "Dan Jukes",
      powers: ["Radiation resistance", "Turning tiny", "Radiation blast"],
    },
    {
      name: "Madame Uppercut",
      age: 39,
      secretIdentity: "Jane Wilson",
      powers: ["Million tonne punch", "Damage resistance", "Superhuman reflexes"],
    },
    {
      name: "Eternal Flame",
      age: 1000000,
      secretIdentity: "Unknown",
      powers: [
        "Immortality",
        "Heat Immunity",
        "Inferno",
        "Teleportation",
        "Interdimensional travel",
      ],
    },
  ],
});

export const defaultJson = JSON.stringify(sampleJson, null, 2);
