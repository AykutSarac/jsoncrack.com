import React from 'react'
import { CgSpinner } from 'react-icons/cg'
import styled, { keyframes } from 'styled-components'

const rotateAnimation = keyframes`
  to { transform: rotate(360deg); }
`;

const StyledSpinnerWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 25px;
    justify-content: center;
    width: 100%;
    height: 100%;
    
    svg {
        animation: ${rotateAnimation} 1s linear infinite;
    }
`;

export const Spinner = () => {
  return (
    <StyledSpinnerWrapper>
        <CgSpinner size={40} />
    </StyledSpinnerWrapper>
  )
}
