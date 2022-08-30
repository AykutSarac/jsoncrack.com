import { useRouter } from "next/router";
import React from "react";
import { Button } from "src/components/Button";
import styled from "styled-components";

export const StyledIncompatible = styled.div`
  display: none;

  @media only screen and (max-width: 568px) {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    background: ${({ theme }) => theme.BLACK_LIGHT};
    color: ${({ theme }) => theme.SILVER};
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    z-index: 200;

    button {
      margin-top: 60px;
    }

    &::before {
      content: "Uh, oh!";
      font-weight: 600;
      font-size: 60px;
      opacity: 0.6;
    }
  }
`;

export const Incompatible: React.FC = () => {
  const { push } = useRouter();

  return (
    <StyledIncompatible>
      This app is not compatible with your device!
      <Button className="incompatible" onClick={() => push("/")}>
        Go Back
      </Button>
    </StyledIncompatible>
  );
};
