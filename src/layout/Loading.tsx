import React from "react";
import { useRouter } from "next/router";
import { LoadingOverlay } from "@mantine/core";

export const Loading = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const handleStart = (url: string) => {
      return url !== router.asPath && (url === "/editor" || url === "/widget") && setLoading(true);
    };

    const handleComplete = (url: string) => url === router.asPath && setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  if (loading) {
    return <LoadingOverlay visible loaderProps={{ color: "#7AB1FF", size: 70 }} />;
  }

  return null;
};
