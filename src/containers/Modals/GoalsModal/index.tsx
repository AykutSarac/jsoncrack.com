import React from "react";
import { useRouter } from "next/router";
import { FaHeart, FaTwitter } from "react-icons/fa";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import styled from "styled-components";

const StyledTitle = styled.p`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.TEXT_POSITIVE};
  flex: 1;
  font-weight: 700;
  margin-top: 0;

  &::after {
    background: ${({ theme }) => theme.TEXT_POSITIVE};
    height: 1px;

    content: "";
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    margin-left: 4px;
    opacity: 0.6;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  padding: 40px 0 0;
  gap: 20px;
`;

export const GoalsModal = ({ visible, setVisible }) => {
  const { push } = useRouter();

  return (
    <Modal visible={visible} setVisible={setVisible} size="md">
      <Modal.Header>Help JSON Crack&apos;s Goals</Modal.Header>
      <Modal.Content>
        <StyledTitle>OUR GOAL</StyledTitle>
        Dear user,
        <br />
        <br />
        We are the team behind JSON Crack, an open-source JSON visualization app that
        helps users better understand and work with complex JSON data. We are
        passionate about making JSON data more accessible and user-friendly, and we
        believe our app has the potential to make a real difference for developers
        and data analysts alike.
        <br />
        <br />
        However, developing and maintaining JSON Crack takes time and resources, and
        we would love your support in helping us continue to improve the app and make
        it even more useful for our users. As a sponsor, your support would help us
        to continue to develop and maintain JSON Crack, and would allow us to add new
        features and capabilities to the app.
        <br />
        <br />
        We believe that JSON Crack has the potential to make a real difference for
        developers and data analysts, and we would be grateful for your support in
        helping us continue to improve the app. Thank you for considering sponsoring
        JSON Crack.
        <br />
        <br />
        Sincerely,
        <br />
        <br />
        The JSON Crack team
        <ButtonsWrapper>
          <Button
            href="https://github.com/sponsors/AykutSarac"
            target="_blank"
            rel="me"
            status="DANGER"
            block
            link
          >
            <FaHeart />
            Sponsor
          </Button>
          <Button
            href={`https://twitter.com/intent/tweet?button=&url=${encodeURIComponent(
              "https://jsoncrack.com"
            )}&text=Looking+to+understand+or+explore+some+JSON?+Just+paste+or+upload+to+visualize+it+as+a+graph+with+JSON+Crack+😍&button=`}
            rel="noreferrer"
            status="SECONDARY"
            block
            link
          >
            <FaTwitter />
            Share on Twitter
          </Button>
        </ButtonsWrapper>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible} />
    </Modal>
  );
};
