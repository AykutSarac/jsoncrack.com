import React from "react";
import Link from "next/link";
import { Flex, Image } from "@mantine/core";

export const JSONCrackLogo = () => {
  return (
    <Link href="/">
      <Flex align="center" gap="sm">
        <Image src="assets/icon.png" width={150} alt="JSON Crack" />
      </Flex>
    </Link>
  );
};
