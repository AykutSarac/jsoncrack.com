import React from "react";
import styled from "styled-components";
import Navbar from "../Navbar";

const StyledLayout = styled.div`
  padding: 24px;
`;

export const Layout: React.FC = ({ children }) => {
  return (
    <StyledLayout>
      <Navbar />
      {children}
    </StyledLayout>
  );
};
