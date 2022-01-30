import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

const StyledLayout = styled.div`
  background: ${({ theme }) => theme.BLACK_SECONDARY};
`;

const DefaultLayout: React.FC = () => {
  return (
    <StyledLayout>
      <Outlet />
    </StyledLayout>
  );
};

export default DefaultLayout;
