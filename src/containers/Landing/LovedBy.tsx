import React from "react";
import { Container, Flex, Text } from "@mantine/core";
import styled from "styled-components";
import CountUp from "react-countup";
import { FaGithub, FaHackerNews, FaProductHunt } from "react-icons/fa6";

interface LovedByProps {
  stars: number;
}

const StyledFeaturedItem = styled.a`
  display: flex;
  gap: 6px;
  align-items: center;
  white-space: nowrap;
  filter: grayscale(1) contrast(0.2);
  transition: filter 0.2s;

  &:hover {
    filter: none;
  }
`;

const Featured = ({ stars }: LovedByProps) => {
  return (
    <Flex align="center" justify="center" gap="lg" wrap="wrap">
      <StyledFeaturedItem
        href="https://github.com/AykutSarac/jsoncrack.com"
        target="_blank"
        rel="noreferrer"
      >
        <FaGithub color="black" size={28} />
        <Text fz="md" fw={600} c="gray.8">
          <CountUp startVal={0} end={stars} enableScrollSpy scrollSpyOnce scrollSpyDelay={200} />{" "}
          Stars
        </Text>
      </StyledFeaturedItem>
      <StyledFeaturedItem
        href="https://news.ycombinator.com/item?id=32626873"
        target="_blank"
        rel="noreferrer"
      >
        <FaHackerNews color="#FF6600" size={28} />
        <Text fz="md" fw={600} c="gray.8">
          Hacker News
        </Text>
      </StyledFeaturedItem>
      <StyledFeaturedItem
        href="https://www.producthunt.com/products/JSON-Crack"
        target="_blank"
        rel="noreferrer"
      >
        <FaProductHunt color="#DA552F" size={28} />
        <Text fz="md" fw={600} c="gray.8">
          Product Hunt
        </Text>
      </StyledFeaturedItem>
    </Flex>
  );
};

export const LovedBy = ({ stars }: LovedByProps) => {
  return (
    <Container pos="relative" mx="auto" p={30} fluid>
      <Featured stars={stars} />
    </Container>
  );
};

// interface TweetCardProps {
//   username: string;
//   handle: string;
//   profileImage: string;
//   tweet: string;
//   tweetId: string;
//   verified?: "company" | "individual";
// }
//
// const TweetCard = ({
//   profileImage,
//   handle,
//   tweetId,
//   tweet,
//   username,
//   verified,
// }: TweetCardProps) => {
//   return (
//     <Paper p="sm" w="fit-content" withBorder radius="md" bg="gray.0" miw={300} maw={450}>
//       <Flex justify="space-between">
//         <Link href={`https://twitter.com/${handle}`} target="_blank">
//           <Flex align="flex-start" gap="sm" direction="row">
//             <Avatar src={profileImage} w={40} h={40} alt={handle} />
//             <Stack gap={0}>
//               <Flex align="center" gap={2}>
//                 <Text c="dark" fz="sm" fw={500}>
//                   {username}
//                 </Text>
//                 {verified && (
//                   <VscVerifiedFilled color={verified === "company" ? "#ECCC4B" : "#1D9BF0"} />
//                 )}
//               </Flex>
//               <Text fz="xs" c="gray.6">
//                 @{handle}
//               </Text>
//             </Stack>
//           </Flex>
//         </Link>
//         <Link title="twitter" target="_blank" href={`https://x.com/${handle}/status/${tweetId}`}>
//           <FaTwitter color="#1EA1F1" size={20} />
//         </Link>
//       </Flex>
//       <Text fz="sm" c="gray.8" mt="lg">
//         {tweet}
//       </Text>
//     </Paper>
//   );
// };
