import React from "react";
import { useNavigate } from "react-router-dom";

const NavigateButton = ({ text, to, icon, className }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className={`flex items-center rounded-xl text-white font-bold py-2 px-4 focus:outline-none ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}{" "}
      {/* Render icon if provided */}
      {text}
    </button>
  );
};

export default NavigateButton;
