import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEarthAsia,
  faVenusMars,
  faRuler,
  faCakeCandles,
} from "@fortawesome/free-solid-svg-icons";

interface KoiDetailsProps {
  category: string;
  sex: string;
  length: number;
  age: number;
}

const KoiDetails: React.FC<KoiDetailsProps> = ({
  category,
  sex,
  length,
  age,
}) => {
  return (
    <div className="mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2">
      <div className="flex items-center w-full">
        <FontAwesomeIcon
          icon={faEarthAsia}
          className="mr-2 text-[#4086c7]  sm:block"
        />
        <div className="w-full pl-2">
          <label className="text-gray-500 text-sm">Category</label>
          <p className="text-black font-semibold">{category || "Unknown"}</p>
        </div>
      </div>
      <div className="flex items-center w-full">
        <FontAwesomeIcon
          icon={faVenusMars}
          className="mr-2 text-[#4086c7]  sm:block"
        />
        <div className="w-full pl-2">
          <label className="text-gray-500 text-sm">Sex</label>
          <p className="text-black font-semibold">{sex || "Unknown"}</p>
        </div>
      </div>
      <div className="flex items-center w-full">
        <FontAwesomeIcon
          icon={faRuler}
          className="mr-2 text-[#4086c7]  sm:block"
        />
        <div className="w-full pl-2">
          <label className="text-gray-500 text-sm">Length</label>
          <p className="text-black font-semibold">{length}cm</p>
        </div>
      </div>
      <div className="flex items-center w-full">
        <FontAwesomeIcon
          icon={faCakeCandles}
          className="mr-2 text-[#4086c7]  sm:block"
        />
        <div className="w-full pl-2">
          <label className="text-gray-500 text-sm">Age</label>
          <p className="text-black font-semibold">{age}y</p>
        </div>
      </div>
    </div>
  );
};

export default KoiDetails;
