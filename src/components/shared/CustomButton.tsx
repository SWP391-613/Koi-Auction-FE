import React, { ReactNode } from "react";

interface CustomButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  children,
  className = "",
  type = "button",
  disabled = false,
}) => {
  const baseClassName = `group relative h-16 w-64 rounded-lg border bg-sky-800 p-3 text-left text-base font-bold text-gray-50 overflow-hidden
    hover:border-sky-300 hover:bg-sky-300 hover:text-sky-900 hover:underline hover:underline-offset-4 hover:decoration-2
    duration-500 hover:duration-500 origin-left
    before:absolute before:w-12 before:h-12 before:content-[''] before:right-1 before:top-1 before:z-10 
    before:bg-sky-400 before:rounded-full before:blur-lg before:duration-500
    after:absolute after:z-10 after:w-20 after:h-20 after:content-[''] after:bg-cyan-600 
    after:right-8 after:top-3 after:rounded-full after:blur after:duration-500
    group-hover:before:duration-500 group-hover:after:duration-1000
    hover:after:-right-2 hover:before:top-8 hover:before:right-16 
    hover:after:scale-150 hover:after:blur-none hover:before:-bottom-8 hover:before:blur-none
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClassName}
    >
      <div className="flex items-center justify-start">{children}</div>
    </button>
  );
};

export default CustomButton;
