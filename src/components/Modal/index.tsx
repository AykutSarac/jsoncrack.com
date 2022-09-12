import React from "react";
import { Button } from "src/components/Button";
import useKeyPress from "src/hooks/useKeyPress";
import { ReactComponent } from "src/typings/global";
import * as Styled from "./styles";

type ControlProps = React.PropsWithChildren<{
  setVisible: (status: boolean) => void;
}>;

type ModalTypes = {
  Header: ReactComponent;
  Content: ReactComponent;
  Controls: React.FC<ControlProps>;
};

export interface ModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: ReactComponent = ({ children }) => {
  return (
    <Styled.HeaderWrapper>
      <Styled.Title>{children}</Styled.Title>
    </Styled.HeaderWrapper>
  );
};

const Content: ReactComponent = ({ children }) => {
  return <Styled.ContentWrapper>{children}</Styled.ContentWrapper>;
};

const Controls: React.FC<ControlProps> = ({ children, setVisible }) => {
  const handleEspacePress = useKeyPress("Escape");

  React.useEffect(() => {
    if (handleEspacePress) setVisible(false);
  }, [handleEspacePress, setVisible]);

  return (
    <Styled.ControlsWrapper>
      <Button onClick={() => setVisible(false)}>Close</Button>
      {children}
    </Styled.ControlsWrapper>
  );
};

const Modal: React.FC<React.PropsWithChildren<ModalProps>> & ModalTypes = ({
  children,
  visible,
  setVisible,
}) => {
  const onClick = (e: React.SyntheticEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      setVisible(v => !v);
    }
  };

  if (!visible) return null;

  return (
    <Styled.ModalWrapper onClick={onClick}>
      <Styled.ModalInnerWrapper>{children}</Styled.ModalInnerWrapper>
    </Styled.ModalWrapper>
  );
};

Modal.Header = Header;
Modal.Content = Content;
Modal.Controls = Controls;

export { Modal };
