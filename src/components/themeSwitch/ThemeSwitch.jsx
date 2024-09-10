import React, { useContext } from "react";
import { ThemeContext } from "../../pages/theme/ThemeContext";
import "./ThemeSwitch.css";

const ThemeSwitch = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <label htmlFor="switch" className="switch">
      <input
        id="switch"
        type="checkbox"
        checked={!isDarkMode}
        onChange={toggleTheme}
      />
      <span className="slider" />
      <span className="decoration" />
    </label>
  );
};

export default ThemeSwitch;
