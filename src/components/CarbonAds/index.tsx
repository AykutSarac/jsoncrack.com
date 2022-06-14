import React from "react";
import styled from "styled-components";

const StyledWrapper = styled.div`
  height: 100px;

  #carbonads {
    width: 100%;
    display: flex;
  }

  #carbonads > span {
    max-width: 100%;
    width: 100%;
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
