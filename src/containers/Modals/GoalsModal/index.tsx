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
  font-family: "Catamaran", sans-serif;
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
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Help JSON Crack&apos;s Goals</Modal.Header>
      <Modal.Content>
        <StyledTitle>OUR GOAL</StyledTitle>
        <b>JSON Crack&apos;s Goal</b> is to keep the service completely free and open
        source for everyone! For the contiunity of our service and keep the new
        updates coming we need your support to make that possible ❤️
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
