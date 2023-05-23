import React from "react";
import styled from "styled-components";
import { Badge, Button, Image, List, ThemeIcon, Title } from "@mantine/core";
import { BsCheck } from "react-icons/bs";
import { paymentURL } from "src/constants/data";

const StyledPremiumView = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #020015;

  img {
    filter: drop-shadow(2px 4px 6px black);
  }

  .glowing {
    position: relative;
    min-width: 700px;
    height: 550px;
    margin: -150px;
    transform-origin: right;
    animation: colorChange 5s linear infinite;
  }

  .glowing:nth-child(even) {
    transform-origin: left;
  }

  @keyframes colorChange {
    0% {
      filter: hue-rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      filter: hue-rotate(360deg);
      transform: rotate(360deg);
    }
  }

  .glowing span {
    --i: 1;
    position: absolute;
    top: calc(80px * var(--i));
    left: calc(80px * var(--i));
    bottom: calc(80px * var(--i));
    right: calc(80px * var(--i));
  }

  .glowing span::before {
    content: "";
    position: absolute;
    top: 50%;
    left: -8px;
    width: 15px;
    height: 15px;
    background: #f00;
    border-radius: 50%;
  }

  .glowing span:nth-child(3n + 1)::before {
    background: rgba(134, 255, 0, 1);
    box-shadow: 0 0 20px rgba(134, 255, 0, 1), 0 0 40px rgba(134, 255, 0, 1),
      0 0 60px rgba(134, 255, 0, 1), 0 0 80px rgba(134, 255, 0, 1), 0 0 0 8px rgba(134, 255, 0, 0.1);
  }

  .glowing span:nth-child(3n + 2)::before {
    background: rgba(255, 214, 0, 1);
    box-shadow: 0 0 20px rgba(255, 214, 0, 1), 0 0 40px rgba(255, 214, 0, 1),
      0 0 60px rgba(255, 214, 0, 1), 0 0 80px rgba(255, 214, 0, 1), 0 0 0 8px rgba(255, 214, 0, 0.1);
  }

  .glowing span:nth-child(3n + 3)::before {
    background: rgba(0, 226, 255, 1);
    box-shadow: 0 0 20px rgba(0, 226, 255, 1), 0 0 40px rgba(0, 226, 255, 1),
      0 0 60px rgba(0, 226, 255, 1), 0 0 80px rgba(0, 226, 255, 1), 0 0 0 8px rgba(0, 226, 255, 0.1);
  }

  .glowing span:nth-child(3n + 1) {
    animation: animate 10s alternate infinite;
  }

  .glowing span:nth-child(3n + 2) {
    animation: animate-reverse 3s alternate infinite;
  }

  .glowing span:nth-child(3n + 3) {
    animation: animate 8s alternate infinite;
  }

  @keyframes animate {
    0% {
      transform: rotate(180deg);
    }
    50% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes animate-reverse {
    0% {
      transform: rotate(360deg);
    }

    50% {
      transform: rotate(180deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }
`;

const StyledInfo = styled.p`
  width: 60%;
  font-weight: 600;
  font-size: 20px;
  text-align: center;
  color: ${({ theme }) => theme.TEXT_NORMAL};
`;

const StyledContent = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
`;

export const PremiumView = () => (
  <StyledPremiumView>
    <StyledContent>
      <Title align="center">
        <Image width="300" src="assets/icon.png" alt="JSON Crack" />
      </Title>
      <StyledInfo>
        Upgrade JSON Crack to premium and explore full potantial of your data!
      </StyledInfo>

      <List
        spacing="xs"
        size="md"
        center
        icon={
          <ThemeIcon color="teal" size={20} radius="xl">
            <BsCheck size="1rem" />
          </ThemeIcon>
        }
      >
        <List.Item>No Ads</List.Item>
        <List.Item>Edit directly on graph</List.Item>
        <List.Item>JSON Schema support</List.Item>
        <List.Item>Visualize data at full capability</List.Item>
        <List.Item>Save & share up to 200 files</List.Item>
        <List.Item
          icon={
            <ThemeIcon color="dark.4" size={20} radius="xl">
              <BsCheck size="1rem" />
            </ThemeIcon>
          }
        >
          API Access <Badge>Soon</Badge>
        </List.Item>
      </List>

      <Button
        mt="lg"
        size="lg"
        component="a"
        variant="gradient"
        gradient={{ from: "blue", to: "teal" }}
        href={paymentURL}
        target="_blank"
      >
        UPGRADE TO PREMIUM $5.00
      </Button>
    </StyledContent>

    <div className="glowing">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </StyledPremiumView>
);
