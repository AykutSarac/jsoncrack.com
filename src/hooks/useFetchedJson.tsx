import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { decompressFromBase64 } from "lz-string";
import { defaultJson } from "src/constants/data";
import { getJson } from "src/services/db/json";
import useGraph from "src/store/useGraph";

export function useJson() {
  const { query, isReady } = useRouter();
  const setLoading = useGraph(state => state.setLoading);
  const setJson = useGraph(state => state.setJson);

  const { data, isLoading, status } = useQuery(
    ["dbJson", query.json],
    () => getJson(query.json as string),
    {
      enabled: isReady && !!query.json,
    }
  );

  React.useEffect(() => {
    if (isReady) {
      if (query.json) {
        if (isLoading) return setLoading(true);
        if (status || !data) setJson(defaultJson);

        if (data?.data) setJson(decompressFromBase64(data.data.json) as string);
        setLoading(false);
      } else setJson(defaultJson);
    }
  }, [data, isLoading, isReady, query.json, setJson, setLoading, status]);

  return { data };
}
