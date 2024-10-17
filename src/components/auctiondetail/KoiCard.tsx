import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "~/utils/currencyUtils";

interface KoiCardProps {
  name: string;
  thumbnail: string;
  ownerId: string;
  breeder: string;
  length: number;
  sex: string;
  age: string;
  auctionId: number;
  status: string;
  currentBid: number;
}

const KoiCard: React.FC<KoiCardProps> = ({
  name,
  thumbnail,
  ownerId,
  breeder,
  length,
  sex,
  age,
  auctionId,
  status,
  currentBid,
}) => {
  return (
    <div className="bg-blue-500 rounded-lg overflow-hidden shadow-md">
      <div className="relative h-48">
        <img
          src={thumbnail}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white rounded-full p-2">
          <FontAwesomeIcon icon={faUser} className="mr-1" />
          {ownerId}
        </div>
        <div className="absolute bottom-2 left-2 text-white">
          <FontAwesomeIcon icon={faStar} className="mr-1" />
          <FontAwesomeIcon icon={faStar} className="mr-1" />
          <FontAwesomeIcon icon={faStar} className="mr-1" />
          <FontAwesomeIcon icon={faStar} className="mr-1" />
        </div>
      </div>
      <div className="p-4 bg-white">
        <h2 className="text-xl font-bold mb-2">{name}</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-600">Breeder</p>
            <p className="font-semibold">{breeder}</p>
          </div>
          <div>
            <p className="text-gray-600">Length</p>
            <p className="font-semibold">{length}cm</p>
          </div>
          <div>
            <p className="text-gray-600">Sex</p>
            <p className="font-semibold">{sex}</p>
          </div>
          <div>
            <p className="text-gray-600">Age</p>
            <p className="font-semibold">{age}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-500" />
            <span>{status}</span>
          </div>
          <div className="font-bold text-lg">{formatCurrency(currentBid)}</div>
        </div>
      </div>
    </div>
  );
};

export default KoiCard;
