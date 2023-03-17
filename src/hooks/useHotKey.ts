import { useEffect, useState } from 'react';

type Key = string | number;

type Props = {
    key: string | number;
    callback: () => void;
}

const isKeyMatch = (eventKey: string, key: string | number) => eventKey.toUpperCase() === key.toString().toUpperCase()

export function useHotkey({key, callback} : Props) {
  const [hotkeyPressed, setHotkeyPressed] = useState(false);
 
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isKeyMatch(event.key,key) && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        callback();
        setHotkeyPressed(true);
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      // event.metaKey (for Mac) and the event.ctrlKey (for both Mac and Windows).
      if (isKeyMatch(event.key,key)  && (event.ctrlKey || event.metaKey)) {
        setHotkeyPressed(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [key, callback]);

  return hotkeyPressed;
}
