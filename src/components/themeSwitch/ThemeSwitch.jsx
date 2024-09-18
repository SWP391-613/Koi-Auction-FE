import React, { useContext } from "react";
import { ThemeContext } from "../../pages/theme/ThemeContext";
import "./ThemeSwitch.scss";

const ThemeSwitch = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <label htmlFor="switch" className="switch relative inline-block w-14 h-8">
      <input
        id="switch"
        type="checkbox"
        checked={!isDarkMode}
        onChange={toggleTheme}
        className="opacity-0 w-0 h-0"
      />
      <span className="slider absolute top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-500"></span>
      <span className="decoration absolute rounded-full top-[15%] right-[20%] h-[2px] w-[2px] bg-[#e5f041e6] transition-all duration-500"></span>
    </label>
  );
};

export default ThemeSwitch;
