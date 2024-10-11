import React from "react";

type CrudButtonProps = {
  onClick: () => void;
  ariaLabel: string;
  svgPath: string; // Accepting a string path to the SVG file (relative to /public/icons)
  size?: number;   // Optional size for the icon
};

export const CrudButton: React.FC<CrudButtonProps> = ({
  onClick,
  ariaLabel,
  svgPath,
  size = 24, // Default size for the SVG
}) => {
  return (
    <button
      onClick={onClick}
      className="focus:shadow-outline-gray bg-white hover:bg-[#F1F1F1] flex items-center justify-center rounded-lg px-2 py-2 text-sm font-medium leading-5 text-purple-100 focus:outline-none dark:text-gray-400"
      aria-label={ariaLabel}
    >
      {/* Dynamically load SVG from the public folder */}
      <img
        src={`/icons/${svgPath}`} // Using the relative path from /public/icons
        alt={ariaLabel}
        width={size}
        height={size}
        className="inline-block"
      />
    </button>
  );
};
