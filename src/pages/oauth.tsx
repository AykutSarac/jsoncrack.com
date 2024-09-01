import { useEffect } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { SEO } from "src/constants/seo";
import { supabase } from "src/lib/api/supabase";

const Oauth = () => {
  const { push } = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) return console.error(error);
      if (!data.session) return;
      push("/editor");
    });
  }, [push]);

  return (
    <>
      <NextSeo {...SEO} canonical="https://jsoncrack.com/oauth" nofollow noindex />
    </>
  );
};

export default Oauth;
