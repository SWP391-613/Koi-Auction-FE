// FooterSection.tsx
import React from "react";
import { FooterSectionProps } from "./FooterTypes";
import FooterButton from "./FooterButton";

const FooterSection: React.FC<FooterSectionProps> = ({ title, links }) => {
  return (
    <div className="flex flex-col w-full md:w-1/6">
      <h3 className="mb-3 pl-8 p-2 rounded-3xl bg-gray-400 text-md font-bold text-[#121212]">
        {title}
      </h3>
      {links.map((link, index) => (
        <FooterButton key={index} {...link} />
      ))}
    </div>
  );
};

export default FooterSection;
