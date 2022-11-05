import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
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

export const LoginModal: React.FC<ModalProps> = ({ setVisible, visible }) => {
  const login = useUser(state => state.login);

  return (
    <Modal visible={visible} setVisible={setVisible}>
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
                setVisible(false);
              }
            }}
            onError={() => {
              toast.error("Unable to login to Google account!");
            }}
          />
        </StyledLoginWrapper>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible} />
    </Modal>
  );
};
