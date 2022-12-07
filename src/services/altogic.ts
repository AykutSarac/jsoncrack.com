import { createClient } from "altogic";

let envUrl = process.env.NEXT_ALTOGIC_ENV_URL as string;
let clientKey = process.env.NEXT_ALTOGIC_CLIENT_KEY as string;

const altogic = createClient(
  "https://815e-4e5a.c5-na.altogic.com/",
  "f1e92022789f4ccf91273a345ab2bdf8",
  {
    signInRedirect: "/signin",
  }
);

export { altogic };
