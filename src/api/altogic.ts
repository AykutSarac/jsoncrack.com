import { APIError, createClient } from "altogic";

let envUrl = process.env.NEXT_PUBLIC_ALTOGIC_ENV_URL as string;
let clientKey = process.env.NEXT_PUBLIC_ALTOGIC_CLIENT_KEY as string;

const altogic = createClient(envUrl, clientKey);

export interface AltogicResponse<T> {
  data: T;
  errors: APIError | null;
}

export { altogic };
