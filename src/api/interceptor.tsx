import axios from "axios";
import toast from "react-hot-toast";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

const HttpClient = axios.create({
  baseURL: IS_DEVELOPMENT ? "https://815e-4e5a.c5-na.altogic.com/" : "",
});

HttpClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response.data?.errors) {
      error.response.data?.errors.forEach(err => toast.error(err.message));
    } else {
      toast.error("An unexpected error occured!");
    }
    return Promise.reject(false);
  }
);

export { HttpClient };
