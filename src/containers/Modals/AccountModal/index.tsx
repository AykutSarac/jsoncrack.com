import React from "react";
import { IoRocketSharp } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { Button } from "src/components/Button";
import { Modal, ModalProps } from "src/components/Modal";
import useUser from "src/store/useUser";
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

const StyledAccountWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  padding: 16px;
  border-radius: 6px;

  button {
    flex-basis: 100%;
  }
`;

const StyledAvatar = styled.img`
  border-radius: 100%;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};

  & > div {
    font-weight: 400;
    font-size: 14px;
    color: ${({ theme }) => theme.INTERACTIVE_ACTIVE};
  }
`;

const AccountView: React.FC<Pick<ModalProps, "setVisible">> = ({ setVisible }) => {
  const user = useUser(state => state.user);
  const isPremium = useUser(state => state.isPremium());
  const logout = useUser(state => state.logout);

  return (
    <>
      <Modal.Header>Account</Modal.Header>
      <Modal.Content>
        <StyledTitle>Hello, {user?.name}!</StyledTitle>
        <StyledAccountWrapper>
          <StyledAvatar width="80" height="80" src={user?.profilePicture} alt={user?.name} />
          <StyledContainer>
            USERNAME
            <div>{user?.name}</div>
          </StyledContainer>
          <StyledContainer>
            ACCOUNT STATUS
            <div>
              {isPremium ? "PREMIUM " : "Free"}
              {isPremium && <MdVerified />}
            </div>
          </StyledContainer>
          <StyledContainer>
            EMAIL
            <div>{user?.email}</div>
          </StyledContainer>
          <StyledContainer>
            REGISTRATION
            <div>{user?.signUpAt && new Date(user.signUpAt).toDateString()}</div>
          </StyledContainer>
          {isPremium ? (
            <Button
              status="DANGER"
              block
              onClick={() => window.open("https://patreon.com/jsoncrack", "_blank")}
            >
              <IoRocketSharp />
              Cancel Subscription
            </Button>
          ) : (
            <Button href="/pricing" status="TERTIARY" block link>
              <IoRocketSharp />
              UPGRADE TO PREMIUM!
            </Button>
          )}
        </StyledAccountWrapper>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible}>
        <Button
          status="DANGER"
          onClick={() => {
            logout();
            setVisible(false);
          }}
        >
          Log Out
        </Button>
      </Modal.Controls>
    </>
  );
};

export const AccountModal: React.FC<ModalProps> = ({ setVisible, visible }) => {
  return (
    <Modal visible={visible} setVisible={setVisible}>
      <AccountView setVisible={setVisible} />
    </Modal>
  );
};
