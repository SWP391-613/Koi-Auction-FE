import React from "react";
import { useNavigate } from "react-router-dom";

const NavigateButton = ({ text, to, className }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className={`rounded-xl text-white font-bold py-2 px-4 focus:outline-none ${className}`}
    >
      {text}
    </button>
  );
};

export default NavigateButton;
