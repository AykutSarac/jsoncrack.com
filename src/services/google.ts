import axios from "axios";

const validateToken = async <T>(token: string) => {
  return await axios.get<T>(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
  );
};

export { validateToken };
