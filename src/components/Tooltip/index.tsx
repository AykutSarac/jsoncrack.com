import React from "react";
import styled from "styled-components";

interface TooltipProps {
  title: string;
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
  transform: translate(calc(100% + 15px), 25%);
  z-index: 5;
  background: ${({ theme }) => theme.SILVER};
  color: ${({ theme }) => theme.SILVER_DARK};
  border-radius: 5px;
  padding: 4px 8px;
  opacity: ${({ visible }) => (visible ? "1" : "0")};
  transition: opacity 0.2s;
  white-space: nowrap;
  font-size: 14px;
  user-select: none;
`;

const StyledChildren = styled.div``;

export const Tooltip: React.FC<TooltipProps> = ({ children, title }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <StyledTooltipWrapper>
      <StyledTooltip visible={visible}>{title}</StyledTooltip>
      <StyledChildren
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </StyledChildren>
    </StyledTooltipWrapper>
  );
};
