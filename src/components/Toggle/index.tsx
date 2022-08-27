import React from "react";
import styled from "styled-components";
import { IoIosCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";

interface ToggleProps {
  checked?: boolean;
  children?: React.ReactNode;
  onChange?: (value: boolean) => void;
}

const StyledToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  user-select: none;
  width: 100%;
  gap: 6px;
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.INTERACTIVE_ACTIVE};
  font-weight: 500;
  cursor: pointer;
`;

const StyledToggle = styled.div<{ active: boolean }>`
  position: relative;
  display: flex;
  justify-content: ${({ active }) => (active ? "right" : "left")};
  align-items: center;
  width: 40px;
  height: 24px;
  padding: 2px;
  border-radius: 14px;
  background: ${({ active }) => (active ? "#3AA55D" : "#72767c")};
  transition: 0.1s;
  cursor: pointer;

  input {
    display: none;
  }
`;

const Toggle: React.FC<ToggleProps> = ({
  children,
  checked = false,
  onChange,
}) => {
  const [isChecked, setIsChecked] = React.useState(checked);

  const handleClick = () => {
    setIsChecked(!isChecked);
    if (onChange) onChange(!isChecked);
  };

  return (
    <StyledToggleWrapper>
      <StyledToggle active={isChecked} onClick={handleClick}>
        {isChecked ? (
          <IoIosCheckmarkCircle size={22} color="white" />
        ) : (
          <IoMdCloseCircle size={22} color="white" />
        )}
        <input type="checkbox" checked={isChecked} onChange={handleClick} />
      </StyledToggle>
      <StyledLabel onClick={handleClick}>{children}</StyledLabel>
    </StyledToggleWrapper>
  );
};

export default Toggle;
