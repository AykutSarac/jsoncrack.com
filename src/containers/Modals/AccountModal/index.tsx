import React from "react";
import styled from "styled-components";
import { Modal, Group, Button, Badge, Avatar, Grid, Divider, ModalProps } from "@mantine/core";
import { IoRocketSharp } from "react-icons/io5";
import useModal from "src/store/useModal";
import useUser from "src/store/useUser";

const StyledTitle = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.TEXT_POSITIVE};
  flex: 1;
  font-weight: 700;

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

export const AccountModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const setVisible = useModal(state => state.setVisible);
  const user = useUser(state => state.user);
  const isPremium = useUser(state => state.isPremium());
  const logout = useUser(state => state.logout);

  return (
    <Modal title="Account" opened={opened} onClose={onClose} centered>
      <StyledTitle>Hello, {user?.name}!</StyledTitle>
      <Group py="sm">
        <Grid gutter="xs">
          <Grid.Col span={2}>
            <Avatar size="lg" radius="lg" src={user?.profilePicture} alt={user?.name} />
          </Grid.Col>
          <Grid.Col span={4}>
            <StyledContainer>
              USERNAME
              <div>{user?.name}</div>
            </StyledContainer>
          </Grid.Col>
          <Grid.Col span={6}>
            <StyledContainer>
              ACCOUNT STATUS
              <div>
                {isPremium ? (
                  <Badge>Premium</Badge>
                ) : (
                  <Badge variant="outline" color="gray">
                    Free
                  </Badge>
                )}
              </div>
            </StyledContainer>
          </Grid.Col>
          <Grid.Col span={6}>
            <StyledContainer>
              EMAIL
              <div>{user?.email}</div>
            </StyledContainer>
          </Grid.Col>
          <Grid.Col span={4}>
            <StyledContainer>
              REGISTRATION
              <div>{user?.signUpAt && new Date(user.signUpAt).toDateString()}</div>
            </StyledContainer>
          </Grid.Col>
        </Grid>
      </Group>
      <Divider py="xs" />
      <Group position="right">
        {isPremium ? (
          <Button
            variant="light"
            color="red"
            onClick={() => window.open("https://patreon.com/herowand", "_blank")}
            leftIcon={<IoRocketSharp />}
          >
            Cancel Subscription
          </Button>
        ) : (
          <Button
            variant="gradient"
            gradient={{ from: "teal", to: "lime", deg: 105 }}
            leftIcon={<IoRocketSharp />}
            onClick={() => setVisible("premium")(true)}
          >
            UPGRADE TO PREMIUM!
          </Button>
        )}
        <Button
          color="red"
          onClick={() => {
            logout();
            onClose();
          }}
        >
          Log Out
        </Button>
      </Group>
    </Modal>
  );
};
