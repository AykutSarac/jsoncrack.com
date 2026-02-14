import { FaMoon, FaSun } from "react-icons/fa6";
import useConfig from "../../../store/useConfig";
import { StyledToolElement } from "./styles";

export const ThemeToggle = () => {
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);
  const toggleDarkMode = useConfig(state => state.toggleDarkMode);

  return (
    <StyledToolElement title="Fullscreen" onClick={() => toggleDarkMode(!darkmodeEnabled)}>
      {!darkmodeEnabled ? <FaMoon size="18" /> : <FaSun size="18" />}
    </StyledToolElement>
  );
};
