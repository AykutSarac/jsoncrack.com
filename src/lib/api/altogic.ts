import { APIError, createClient } from "altogic";

const envUrl = process.env.NEXT_PUBLIC_ALTOGIC_ENV_URL as string;
const clientKey = process.env.NEXT_PUBLIC_ALTOGIC_CLIENT_KEY as string;

const altogic = createClient(envUrl, clientKey);

interface AltogicResponse<T> {
  data: T;
  errors: APIError | null;
}

export { altogic };
export type { AltogicResponse };
