import React from "react";

const useKeyPress = (targetKey: string) => {
  const [keyPressed, setKeyPressed] = React.useState(false);

  React.useEffect(() => {
    function downHandler({ key }) {
      if (key === targetKey) setKeyPressed(true);
    }
    const upHandler = ({ key }) => {
      if (key === targetKey) setKeyPressed(false);
    };
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]);

  return keyPressed;
};

export default useKeyPress;
