import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Button, Center, Container, Grid, Image, Text, Title } from "@mantine/core";
import { VscHeart } from "react-icons/vsc";
import Layout from "src/layout/Layout";

const Oss: React.FC<{ sponsors: any[] }> = ({ sponsors }) => {
  return (
    <Layout>
      <Head>
        <title>JSON Crack | Open Source Supporters</title>
      </Head>
      <Container>
        <Image mx="auto" src="assets/oss_banner.webp" radius="md" maw={800} alt="oss banner" />
      </Container>
      <Center pt="lg">
        <Button
          component="a"
          href="https://github.com/sponsors/AykutSarac"
          variant="light"
          size="lg"
          color="red"
          leftIcon={<VscHeart />}
          target="_blank"
        >
          BECOME PART OF IT
        </Button>
      </Center>
      <Container py={50}>
        <Title pb="md">Thank you!</Title>
        <Text maw={500}>
          &ldquo;We would like to extend our sincerest gratitude to all of our sponsors for their
          invaluable support and contribution towards JSON Crack.&rdquo;
        </Text>
      </Container>
      <Container>
        <Title order={3} pb="xl">
          Sponsors
        </Title>
        <Grid gutter={30}>
          {sponsors?.map(sponsor => (
            <Grid.Col span="content" key={sponsor.handle}>
              <Link href={sponsor.profile}>
                <Image radius="md" width={"4rem"} src={sponsor.avatar} alt={sponsor.handle} />
                <Text pt="sm" align="center" fz="xs">
                  {sponsor.handle}
                </Text>
              </Link>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default Oss;

export async function getStaticProps() {
  const res = await fetch("https://ghs.vercel.app/sponsors/aykutsarac");
  const data = await res.json();

  return {
    props: {
      sponsors: data?.sponsors.reverse() || [],
    },
  };
}
