import Script from "next/script";
import React from "react";
import styled from "styled-components";

const StyledWrapper = styled.span<{ editor?: boolean }>`
  #carbonads {
    width: 100%;
    display: flex;
  }

  ${({ theme, editor }) =>
    editor &&
    `
    #carbonads {
      border-radius: 0;
      border-top: 1px solid ${theme.BACKGROUND_MODIFIER_ACCENT};
    }

    #carbonads > span {
      max-width: 100%;
      width: 100%;
  }
  `};

  @media all and (display-mode: standalone) {
    #carbonads {
      display: none;
    }
  }
`;

export const CarbonAds: React.FC<{ editor?: boolean }> = ({
  editor = false,
}) => {
  return (
    <StyledWrapper editor={editor} id="carbon-wrapper">
      <Script
        type="text/javascript"
        src="//cdn.carbonads.com/carbon.js?serve=CE7IPKQL&placement=jsonvisiocom"
        id="_carbonads_js"
        strategy="lazyOnload"
        onLoad={() => {
          const init = () => {
            const parent = document.getElementById("carbon-wrapper");
            const ads = document.getElementById("carbonads");

            if (ads === null) return setTimeout(() => init(), 500);

            parent?.appendChild(ads);
          };

          init();
        }}
      />
    </StyledWrapper>
  );
};
