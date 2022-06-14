import React from "react";
import styled from "styled-components";

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const CarbonAds = () => {
  return (
    <StyledWrapper>
      <script
        type="text/javascript"
        src="//cdn.carbonads.com/carbon.js?serve=CE7IPKQL&placement=jsonvisiocom"
        id="_carbonads_js"
      ></script>
    </StyledWrapper>
  );
};
