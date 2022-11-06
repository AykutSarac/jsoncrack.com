import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { IoRocketSharp } from "react-icons/io5";
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

const StyledModalContent = styled.div`
  margin-bottom: 20px;
`;

const StyledLoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledButton = styled(Button)``;

const StyledAccountWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  padding: 16px;
  border-radius: 6px;

  button {
    flex-basis: 100%;
    background: #9036af;
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
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};

  & > div {
    font-weight: 400;
    color: ${({ theme }) => theme.INTERACTIVE_ACTIVE};
  }
`;

const LoginView: React.FC<Pick<ModalProps, "setVisible">> = ({ setVisible }) => {
  const login = useUser(state => state.login);

  return (
    <>
      <Modal.Header>Login to JSON Crack</Modal.Header>
      <Modal.Content>
        <StyledTitle>Join Now!</StyledTitle>
        <StyledModalContent>
          Login to JSON Crack to{" "}
          <b>
            save your JSON files, share links and directly embed into your websites
          </b>{" "}
          without JavaScript instantly!
        </StyledModalContent>
        <StyledLoginWrapper>
          <GoogleLogin
            auto_select
            width="210"
            onSuccess={credentialResponse => {
              if (credentialResponse.credential) {
                login(credentialResponse.credential);
              }
            }}
            onError={() => {
              toast.error("Unable to login to Google account!");
            }}
          />
        </StyledLoginWrapper>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible} />
    </>
  );
};

const AccountView: React.FC<Pick<ModalProps, "setVisible">> = ({ setVisible }) => {
  const user = useUser(state => state.user);
  const logout = useUser(state => state.logout);

  return (
    <>
      <Modal.Header>Account (FREE)</Modal.Header>
      <Modal.Content>
        <StyledTitle>Hello, {user?.given_name}!</StyledTitle>
        <StyledAccountWrapper>
          <StyledAvatar
            width="80"
            height="80"
            src={user?.picture}
            alt={user?.name}
          />
          <StyledContainer>
            USERNAME
            <div>{user?.name}</div>
          </StyledContainer>
          <StyledContainer>
            EMAIL
            <div>{user?.email}</div>
          </StyledContainer>
          <Button block>
            <IoRocketSharp />
            UPDATE TO PREMIUM!
          </Button>
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

export const LoginModal: React.FC<ModalProps> = ({ setVisible, visible }) => {
  const isAuthenticated = useUser(state => state.isAuthenticated);

  return (
    <Modal visible={visible} setVisible={setVisible}>
      {isAuthenticated ? (
        <AccountView setVisible={setVisible} />
      ) : (
        <LoginView setVisible={setVisible} />
      )}
    </Modal>
  );
};
