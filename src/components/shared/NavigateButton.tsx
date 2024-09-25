import React from "react";
import { useNavigate } from "react-router-dom";

const NavigateButton = ({
  text,
  to,
  icon,
  className,
}: {
  text: string;
  to: string;
  icon: JSX.Element;
  className: string;
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className={`flex items-center justify-center rounded-xl px-4 py-2 font-bold focus:outline-none ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}{" "}
      {/* Render icon if provided */}
      {text}
    </button>
  );
};

export default NavigateButton;
