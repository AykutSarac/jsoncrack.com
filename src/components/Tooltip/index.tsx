import React from "react";
import styled from "styled-components";

interface TooltipProps extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
}

const StyledTooltipWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const StyledTooltip = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(calc(100% + 15px), 10%);
  z-index: 5;
  background: ${({ theme }) => theme.BACKGROUND_PRIMARY};
  color: ${({ theme }) => theme.TEXT_NORMAL};
  border-radius: 5px;
  padding: 4px 8px;
  display: ${({ visible }) => (visible ? "initial" : "none")};
  white-space: nowrap;
  font-size: 16px;
  user-select: none;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.07),
    0 4px 8px rgba(0, 0, 0, 0.07), 0 8px 16px rgba(0, 0, 0, 0.07),
    0 16px 32px rgba(0, 0, 0, 0.07), 0 32px 64px rgba(0, 0, 0, 0.07);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-90%, 50%);
    border-width: 8px;
    border-style: solid;
    border-color: transparent ${({ theme }) => theme.BACKGROUND_PRIMARY}
      transparent transparent;
  }

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const StyledChildren = styled.div``;

export const Tooltip: React.FC<React.PropsWithChildren<TooltipProps>> = ({
  children,
  title,
  ...props
}) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <StyledTooltipWrapper {...props}>
      {title && <StyledTooltip visible={visible}>{title}</StyledTooltip>}

      <StyledChildren
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </StyledChildren>
    </StyledTooltipWrapper>
  );
};
