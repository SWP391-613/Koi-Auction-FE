import React from "react";
import { useNavigate } from "react-router-dom";

interface NavigateButtonProps {
  text?: string;
  to: string;
  icon?: JSX.Element;
  className?: string;
}

const NavigateButton: React.FC<NavigateButtonProps> = ({
  text = "Go Back",
  to,
  className = "",
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => navigate(to)}
        className={`border-b-2 border-gray-300 bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group ${className}`}
        type="button"
      >
        <div className="bg-blue-950 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-1 group-hover:w-[184px] z-10 duration-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            height="25px"
            width="25px"
          >
            <path
              d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
              fill="#ffffff"
            />
            <path
              d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </button>
      <p className="text-xl font-bold">{text}</p>
    </div>
  );
};

export default NavigateButton;
