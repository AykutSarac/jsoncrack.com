import { useEffect, useState } from "react";

export const useLoading = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => setLoaded(true), []);
  
  return loaded;
};
