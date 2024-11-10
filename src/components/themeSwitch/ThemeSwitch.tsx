import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import "./ThemeSwitch.scss";

const ThemeSwitch = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <label htmlFor="switch" className="switch relative inline-block h-8 w-14">
      <input
        id="switch"
        type="checkbox"
        checked={!isDarkMode}
        onChange={toggleTheme}
        className="h-0 w-0 opacity-0"
      />
      <span className="slider absolute bottom-0 left-0 right-0 top-0 rounded-full transition-all duration-500"></span>
      <span className="decoration absolute right-[20%] top-[15%] h-[2px] w-[2px] rounded-full bg-[#e5f041e6] transition-all duration-500"></span>
    </label>
  );
};

export default ThemeSwitch;
