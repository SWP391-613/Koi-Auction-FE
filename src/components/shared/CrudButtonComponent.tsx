import React from "react";

type CrudButtonProps = {
  onClick: () => void;
  ariaLabel: string;
  svgPath: string;
};

export const CrudButton: React.FC<CrudButtonProps> = ({
  onClick,
  ariaLabel,
  svgPath,
}) => {
  return (
    <button
      onClick={onClick}
      className="focus:shadow-outline-gray flex items-center justify-between rounded-lg px-2 py-2 text-sm font-medium leading-5 text-purple-100 focus:outline-none dark:text-gray-400"
      aria-label={ariaLabel}
    >
      <svg
        className="h-5 w-5"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d={svgPath}></path>
      </svg>
    </button>
  );
};
