import React from 'react';
import styled from 'styled-components';

const StyledImage = styled.img`
  object-fit: contain;
  height: auto;
  
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

export const Image = ({ ...props }) => {
  return <StyledImage {...props} />
};
