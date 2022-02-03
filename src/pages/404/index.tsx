import React from "react";
import styled from "styled-components";
import { Button } from "src/components/Button";
import { useRouter } from "next/router";
import { Image } from "src/components/Image";

const StyledNotFound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 0 40px;
  text-align: center;
`;

const StyledMessage = styled.h4`
  color: ${({ theme }) => theme.FULL_WHITE};
  font-size: 25px;
  font-weight: 700;
  margin: 10px 0;
`;

const StyledSubMessage = styled.div`
  width: 50%;
  color: ${({ theme }) => theme.SILVER};
  margin-bottom: 25px;
`;

const StyledImageWrapper = styled.div`
  width: 300px;
`;

const NotFound: React.FC = () => {
  const router = useRouter();

  return (
    <StyledNotFound>
      <StyledImageWrapper>
        <Image src="/404.svg" alt="404" width={300} height={400} />
      </StyledImageWrapper>
      <StyledMessage>WIZARDS BEHIND CURTAINS?</StyledMessage>
      <StyledSubMessage>
        Looks like you&apos;re lost, let&apos;s head back to the home!
      </StyledSubMessage>
      <Button type="button" onClick={() => router.push("/")}>
        Go Home
      </Button>
    </StyledNotFound>
  );
};

export default NotFound;
