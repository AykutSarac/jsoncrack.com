import React from "react";
import styled from "styled-components";

const StyledWrapper = styled.span`
  #carbonads {
    width: 100%;
    display: flex;
    border-radius: 0;
  }

  #carbonads > span {
    max-width: 100%;
    width: 100%;
  }

  @media all and (display-mode: standalone) {
    #carbonads {
      display: none;
    }
  }
`;

export const CarbonAds = () => {
  return (
    <StyledWrapper>
      <script
        defer
        type="text/javascript"
        src="//cdn.carbonads.com/carbon.js?serve=CE7IPKQL&placement=jsonvisiocom"
        id="_carbonads_js"
      ></script>
    </StyledWrapper>
  );
};
