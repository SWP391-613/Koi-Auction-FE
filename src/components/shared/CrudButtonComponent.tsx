import React from "react";

type CrudButtonProps = {
  onClick?: () => void;
  ariaLabel: string;
  svgPath: string; // Accepting a string path to the SVG file (relative to /public/icons)
  width?: number; // Optional size for the icon
  height?: number; // Optional size for the icon
};

export const CrudButton: React.FC<CrudButtonProps> = ({
  onClick,
  ariaLabel,
  svgPath,
  width = 24,
  height = 24,
}) => {
  return (
    <button
      onClick={onClick}
      className="focus:shadow-outline-gray hover:bg-blue-200 bg-gray-200 flex items-center justify-center rounded-lg px-2 py-2 text-sm font-medium leading-5 text-purple-100 focus:outline-none dark:text-gray-400"
      aria-label={ariaLabel}
    >
      {/* Dynamically load SVG from the public folder */}
      <img
        src={`/icons/${svgPath}`} // Using the relative path from /public/icons
        alt={ariaLabel}
        width={width}
        height={height}
        className="inline-block"
      />
    </button>
  );
};
