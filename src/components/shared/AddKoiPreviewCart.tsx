import React from "react";
import { AddNewKoiDTO } from "~/types/kois.type";
import { getStatusColor } from "~/utils/colorUtils";
import { getCategoryName } from "~/utils/dataConverter";

interface AddKoiPreviewCartProps {
  items: AddNewKoiDTO[];
}

const AddKoiPreviewCart: React.FC<AddKoiPreviewCartProps> = ({ items }) => {
  return (
    <>
      {items.map((koi, index) => (
        <div
          key={index}
          className="m-2 transform overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-105"
        >
          <div className="flex h-full">
            <div className="flex w-[35%] items-center justify-center bg-[#4086c7]">
              {koi.thumbnail ? (
                <img
                  src={koi.thumbnail}
                  alt={koi.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="m-16 text-xl text-white">No Image Found</span>
              )}
            </div>
            <div className="flex flex-col h-full">
              <div className="p-4 flex-grow">
                <h2 className="mb-3 text-2xl font-semibold">{koi.name}</h2>
                <div
                  className={`rounded-xl p-2 text-md font-bold text-white ${getStatusColor(
                    koi.status_name,
                  )}`}
                >
                  {koi.status_name}
                </div>
              </div>
              <div className="flex flex-col justify-between gap-2 p-4 text-sm text-gray-600">
                <p className="flex items-center justify-between">
                  <span>Length:</span>
                  <span className="text-lg text-black">{koi.length} cm</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Sex:</span>
                  <span className="text-lg text-black">{koi.gender}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Age:</span>
                  <span className="text-lg text-black">{koi.age} years</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Category:</span>
                  <span className="text-lg text-black">
                    {getCategoryName(koi.category_id)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default AddKoiPreviewCart;
