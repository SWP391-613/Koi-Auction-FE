import React from "react";

type CrudButtonProps = {
  onClick: () => void;
  ariaLabel: string;
  svg: React.ReactNode | string; // Accepting an entire SVG element as a prop
};

export const CrudButton: React.FC<CrudButtonProps> = ({
  onClick,
  ariaLabel,
  svg,
}) => {
  return (
    <button
      onClick={onClick}
      className="focus:shadow-outline-gray flex items-center justify-between rounded-lg px-2 py-2 text-sm font-medium leading-5 text-purple-100 focus:outline-none dark:text-gray-400"
      aria-label={ariaLabel}
    >
      {svg}
    </button>
  );
};
