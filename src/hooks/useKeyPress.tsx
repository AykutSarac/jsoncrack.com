import React from "react";

const useKeyPress = (targetKey: string) => {
  const [keyPressed, setKeyPressed] = React.useState(false);

  React.useEffect(() => {
    const downHandler = ({ key }) => {
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

export const useHotkeysforCtrlAndMeta = (targetKeyCode: number, cb: () => void) => {
  React.useEffect(() => {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if ((navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode === targetKeyCode) {
        e.preventDefault();
        cb();
      }
    })

    return () => {
      window.removeEventListener("keydown", cb);
    }
  }, [targetKeyCode, cb]);
}

export default useKeyPress;
