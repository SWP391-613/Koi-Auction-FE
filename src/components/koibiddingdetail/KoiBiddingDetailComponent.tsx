import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { convertDataToReadable } from "~/utils/dataConverter";

// Define the KoiDetail UI component
type KoiDetailItemProps = {
  icon: IconDefinition;
  label: string;
  value: string | number;
  fontSize?: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
};

// Define the KoiDetailItem component, the UI for the koi details
export const KoiDetailItem: React.FC<KoiDetailItemProps> = ({
  icon,
  label,
  value,
  fontSize = "text-xl",
  bgColor = "bg-gray-100",
  textColor = "text-black",
  className = "",
}) => {
  return (
    <div
      className={`${bgColor} m-2 grid grid-cols-2 rounded-3xl border border-gray-300 p-3`}
    >
      <div className="flex items-center">
        <FontAwesomeIcon icon={icon as IconDefinition} color="#4086c7" />
        <p className={`ml-2 text-lg`}>{convertDataToReadable(label)}</p>
      </div>
      <p className={`${fontSize} text-end ${textColor}`}>{value}</p>
    </div>
  );
};
