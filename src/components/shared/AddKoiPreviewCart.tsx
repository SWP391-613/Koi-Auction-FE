import React, { ReactNode } from "react";
import { AddNewKoiDTO } from "~/types/kois.type";
import { getStatusColor } from "~/utils/colorUtils";

interface AddKoiPreviewCartProps {
  items: AddNewKoiDTO[];
  renderCrudButtons?: (koi: AddNewKoiDTO) => ReactNode;
  handleView?: (id: number) => void;
  handleEdit?: (id: number) => void;
  handleDelete?: (id: number) => void;
}

const AddKoiPreviewCart: React.FC<AddKoiPreviewCartProps> = ({
  items,
  renderCrudButtons,
  handleView,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="">
      {items.map((koi, index) => (
        <div
          key={`${index}`}
          className="koi-card m-2 transform overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105"
        >
          <div className="flex gap-10">
            <div className="image-container justify-center items-center flex w-[35%] bg-[#4086c7]">
              {koi.thumbnail ? (
                <img
                  src={koi.thumbnail}
                  alt={koi.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-white text-xl">No Image Found</span>
              )}
            </div>
            <div className="flex flex-col">
              <div className="info p-4">
                <h2 className="title text-2xl font-semibold mb-3">
                  {koi.name}
                </h2>
                <div
                  className={`status rounded-xl p-2 text-left text-white ${getStatusColor(koi.status_name)} text-md font-bold`}
                >
                  {koi.status_name}
                </div>
              </div>
              <div className="flex flex-col justify-between gap-2 text-sm text-gray-600">
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
                  <span className="text-lg text-black">{koi.category_id}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddKoiPreviewCart;
