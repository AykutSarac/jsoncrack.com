import React from "react";
import { Navbar } from "src/components/Navbar";
import styled from "styled-components";

const StyledHome = styled.div`
  padding: 24px;
`;

const Home: React.FC = () => {
  return (
    <StyledHome>
      <Navbar />
    </StyledHome>
  );
};

export default Home;
