import Script from "next/script";
import React from "react";
import { IoMdClose } from "react-icons/io";
import styled from "styled-components";

const StyledCloseBtn = styled.button`
  display: none;
  width: 3vw;
  height: 3vw;
  opacity: 0.8;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 0;
  background: ${({ theme }) => theme.DANGER};
`;

const StyledWrapper = styled.span<{ editor?: boolean }>`
  position: relative;

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

  &:hover {
    ${StyledCloseBtn} {
      display: flex;
    }
  }

  @media all and (display-mode: standalone) {
    #carbonads {
      display: none;
    }
  }
`;

export const CarbonAds: React.FC<{ editor?: boolean }> = ({
  editor = false,
}) => {
  const [isHidden, setIsHidden] = React.useState(false);

  if (isHidden) return null;

  return (
    <StyledWrapper editor={editor} id="carbon-wrapper">
      {editor && (
        <StyledCloseBtn onClick={() => setIsHidden(true)}>
          <IoMdClose color="white" size="15" />
        </StyledCloseBtn>
      )}
      <Script
        type="text/javascript"
        src="https://cdn.carbonads.com/carbon.js?serve=CE7IPKQL&placement=jsonvisiocom"
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
