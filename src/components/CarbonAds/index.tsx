import React from "react";
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

export const CarbonAds = () => {
  const ref = React.useRef<HTMLDivElement>(null!);

  React.useEffect(() => {
    ref.current.innerHTML = "";
    const s = document.createElement("script");
    s.id = "_carbonads_js";
    s.src = `//cdn.carbonads.com/carbon.js?serve=CE7IPKQL&placement=jsoncrackcom`;
    ref.current.appendChild(s);
  }, []);

  return <div ref={ref} className="carbon-outer" />;
};
