import axios, { AxiosResponse } from "axios";

const validateToken = async <T>(token: string): Promise<AxiosResponse<T>> => {
  return await axios.get(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
  );
};

export { validateToken };
