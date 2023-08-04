import {
  createStyles,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
  MediaQuery,
} from "@mantine/core";
import { FaGithubAlt, FaProjectDiagram, FaRegImages } from "react-icons/fa";
import { TbTransform } from "react-icons/tb";
import { VscCloud, VscJson } from "react-icons/vsc";

const mockdata = [
  {
    title: "Free and Open Source",
    description:
      "JSON Crack is an open-source tool, released under the GPL-3 license. This means users can access the source code, modify it, and contribute to the community, fostering innovation and collaboration.",
    icon: <FaGithubAlt size="30" />,
  },
  {
    title: "Interactive Graphs",
    description:
      "JSON Crack visualizes data from JSON, YAML, XML, CSV, and more in interactive graphs. Users can click nodes for more details, edit data, and search through the graph.",
    icon: <FaProjectDiagram size="30" />,
    hideMobile: true,
  },
  {
    title: "Multi-Format Support & Data Conversion",
    description:
      "JSON Crack seamlessly handles various data formats, allowing easy conversion between them.",
    icon: <TbTransform size="30" />,
    hideMobile: true,
  },
  {
    title: "Cloud Storage and Sharing",
    description:
      "JSON Crack comes with built-in cloud storage, allowing users to store their data and easily share links with collaborators or other stakeholders, fostering efficient teamwork and collaboration.",
    icon: <VscCloud size="30" />,
    hideMobile: true,
  },
  {
    title: "Graph Export & Download",
    description:
      "Users have the option to download the generated graph as an image, enabling them to save and share visual representations of their data with others or use them in presentations and reports.",
    icon: <FaRegImages size="30" />,
  },
  {
    title: "JSON Schema Support",
    description:
      "JSON Crack supports JSON Schema, offering users the ability to validate and enforce data structure rules, ensuring data consistency and integrity.",
    icon: <VscJson size="30" />,
  },
];

const useStyles = createStyles(theme => ({
  title: {
    fontSize: rem(34),
    fontWeight: 900,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(24),
    },
  },

  description: {
    maxWidth: 600,
    margin: "auto",

    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },

  card: {
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  cardTitle: {
    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
    },
  },
}));

export function FeaturesCards() {
  const { classes } = useStyles();
  const features = mockdata.map(feature => (
    <MediaQuery
      key={feature.title}
      query="(max-width: 	36em)"
      styles={{ display: feature.hideMobile ? "none" : "initial" }}
    >
      <Card shadow="md" radius="md" className={classes.card} padding="xl">
        {feature.icon}
        <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
          {feature.title}
        </Text>
        <Text fz="sm" c="dimmed" mt="sm">
          {feature.description}
        </Text>
      </Card>
    </MediaQuery>
  ));

  return (
    <Container size="lg" py="xl" mt={40}>
      <Title
        variant="gradient"
        gradient={{ from: "purple", to: "orange", deg: 45 }}
        order={2}
        className={classes.title}
        ta="center"
        mt="sm"
      >
        Transform data into stunning graphs.
      </Title>

      <Text color="dimmed" className={classes.description} ta="center" mt="md">
        JSON Crack empowers users to visualize, analyze, and manipulate data with ease, making it a
        versatile and powerful tool for data representation and exploration.
      </Text>

      <SimpleGrid
        cols={3}
        spacing="xl"
        mt={50}
        breakpoints={[
          { maxWidth: "sm", cols: 1 },
          { maxWidth: "md", cols: 2 },
        ]}
      >
        {features}
      </SimpleGrid>
    </Container>
  );
}
