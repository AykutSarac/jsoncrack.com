import React from "react";
import useConfig from "src/hooks/store/useConfig";
import styled from "styled-components";

async function getSponsors() {
  try {
    const res = await fetch("https://ghs.vercel.app/sponsors/aykutsarac");
    const data = await res.json();

    if (data.sponsors) {
      return data.sponsors.map((user) => ({
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
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const StyledSponsor = styled.li<{ handle: string }>`
  display: flex;
  justify-content: center;
  position: relative;

  &:hover {
    &::before {
      content: "${({ handle }) => handle}";
      position: absolute;
      top: 0;
      background: ${({ theme }) => theme.BACKGROUND_PRIMARY};
      transform: translateY(-130%);
      padding: 6px 8px;
      border-radius: 4px;
      font-weight: 500;
      font-size: 14px;
      color: ${({ theme }) => theme.TEXT_NORMAL};
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      transform: translateY(-110%);
      border-width: 5px;
      border-style: solid;
      border-color: ${({ theme }) => theme.BACKGROUND_PRIMARY} transparent
        transparent transparent;
    }
  }

  img {
    border-radius: 100%;
  }
`;

export const Sponsors = () => {
  const { sponsors, setSponsors } = useConfig();

  React.useEffect(() => {
    if (!sponsors?.nextDate || sponsors?.nextDate < Date.now()) {
      getSponsors().then(setSponsors);
    }
  }, [setSponsors, sponsors?.nextDate]);

  if (!sponsors?.users?.length) return null;

  return (
    <StyledSponsorsWrapper>
      {sponsors.users.map((user) => (
        <StyledSponsor handle={user.handle} key={user.handle}>
          <a href={user.profile}>
            <img
              src={user.avatar}
              alt={user.handle}
              width="40"
              height="40"
              loading="lazy"
            />
          </a>
        </StyledSponsor>
      ))}
    </StyledSponsorsWrapper>
  );
};
