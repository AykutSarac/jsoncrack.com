import Link from "next/link";
import styled from "styled-components";
import {
  createStyles,
  Menu,
  Center,
  Header,
  Container,
  Group,
  Button,
  rem,
  MediaQuery,
} from "@mantine/core";
import { CgChevronDown } from "react-icons/cg";
import { VscStarEmpty } from "react-icons/vsc";
import { paymentURL } from "src/constants/data";
import { JSONCrackLogo } from "../JsonCrackLogo";

const links: HeaderActionProps[] = [
  { link: "/#features", label: "Features" },
  {
    link: "#",
    label: "Product",
    links: [
      {
        link: "https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode",
        label: "VS Code Extension",
      },
      { link: "https://github.com/AykutSarac/jsoncrack.com", label: "View at GitHub" },
      { link: "https://www.producthunt.com/products/JSON-Crack", label: "View at Product Hunt" },
    ],
  },
  {
    link: "#",
    label: "Sponsor",
    links: [
      { link: "/oss", label: "Open Source" },
      { link: "https://github.com/sponsors/AykutSarac", label: "Sponsor" },
      {
        link: paymentURL,
        label: "Become Backer",
      },
    ],
  },
  { link: paymentURL, label: "Plus" },
  { link: "/docs", label: "Docs" },
];

const HEADER_HEIGHT = rem(60);

const useStyles = createStyles(theme => ({
  inner: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: rem(5),
  },
}));

const StyledHeader = styled(Header)`
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid #212121;
`;

interface HeaderActionProps {
  link: string;
  label: string;
  links?: { link: string; label: string }[];
}

export function Navbar() {
  const { classes } = useStyles();
  const items = links.map(link => {
    const menuItems = link.links?.map(item => (
      <Menu.Item key={item.link}>
        <Link href={item.link}>{item.label}</Link>
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu key={link.label} trigger="click">
          <Menu.Target>
            <a href={link.link} className={classes.link}>
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <CgChevronDown size={rem(12)} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link key={link.label} href={link.link} className={classes.link}>
        {link.label}
      </Link>
    );
  });

  return (
    <MediaQuery smallerThan="sm" styles={{ visibility: "hidden" }}>
      <StyledHeader px="lg" height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb={60}>
        <Container className={classes.inner} fluid>
          <Group>
            <JSONCrackLogo />
            <Group spacing={5} className={classes.links}>
              {items}
            </Group>
          </Group>
          <Group>
            <MediaQuery smallerThan="md" styles={{ display: "none" }}>
              <Button
                component="a"
                href="https://github.com/AykutSarac/jsoncrack.com"
                size="xs"
                variant="subtle"
                leftIcon={<VscStarEmpty />}
                target="_blank"
              >
                Star us on GitHub
              </Button>
            </MediaQuery>
            <MediaQuery smallerThan="md" styles={{ display: "none" }}>
              <Link href="/sign-in">
                <Button variant="light" color="blue" size="xs">
                  Sign in
                </Button>
              </Link>
            </MediaQuery>
            <Link href="/editor">
              <Button color="teal" size="xs">
                Editor
              </Button>
            </Link>
          </Group>
        </Container>
      </StyledHeader>
    </MediaQuery>
  );
}
