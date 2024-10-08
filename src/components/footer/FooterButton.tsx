// FooterButton.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { FooterLinkProps } from "./FooterTypes";

const FooterButton: React.FC<FooterLinkProps> = ({ href, icon, text }) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={classNames(
        "group mb-2 flex items-center justify-between rounded-full px-4 py-2 transition duration-300 ease-in-out",
        {
          "text-white font-bold bg-[#4685AF]": isActive,
          "hover:bg-[#5d9fcc]  text-[#2A5069]": !isActive,
        },
      )}
    >
      <div>{icon}</div>
      <span className="ml-2 transition-all duration-300 ease-in-out">
        {text}
      </span>
    </Link>
  );
};

export default FooterButton;
