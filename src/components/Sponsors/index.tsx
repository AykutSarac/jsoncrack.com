import React from "react";
import styled from "styled-components";
import { Avatar, Tooltip, UnstyledButton } from "@mantine/core";
import useStored from "src/store/useStored";

async function getSponsors() {
  try {
    const res = await fetch("https://ghs.vercel.app/sponsors/aykutsarac");
    const data = await res.json();

    if (data.sponsors) {
      return data.sponsors.map(user => ({
        handle: user.handle,
        avatar: user.avatar,
        profile: user.profile,
      }));
    }

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

const StyledSponsorsWrapper = styled.ul`
  display: flex;
  width: 70%;
  margin: 0;
  padding: 0;
  list-style: none;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

export const Sponsors = () => {
  const { sponsors, setSponsors } = useStored();

  React.useEffect(() => {
    if (!sponsors?.nextDate || sponsors?.nextDate < Date.now()) {
      getSponsors().then(setSponsors);
    }
  }, [setSponsors, sponsors?.nextDate]);

  if (!sponsors?.users?.length) return null;

  return (
    <StyledSponsorsWrapper>
      {sponsors.users.map(user => (
        <Tooltip label={user.handle} key={user.handle}>
          <UnstyledButton
            component="a"
            href={user.profile}
            variant="subtle"
            target="_blank"
            rel="noreferrer"
          >
            <Avatar radius="md" src={user.avatar} alt={user.handle} />
          </UnstyledButton>
        </Tooltip>
      ))}
    </StyledSponsorsWrapper>
  );
};
