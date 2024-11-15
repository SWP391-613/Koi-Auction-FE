import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { KoiDetailModel } from "~/types/kois.type";
import { getStatusColor } from "~/utils/colorUtils";

interface KoiCartProps {
  items: KoiDetailModel[];
  renderCrudButtons?: (koi: KoiDetailModel) => ReactNode;
  handleView?: (id: number) => void;
  handleEdit?: (id: number) => void;
  handleDelete?: (id: number) => void;
}

const KoiCart: React.FC<KoiCartProps> = ({
  items,
  renderCrudButtons,
  handleView,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="koi-container grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {items.map((koi, index) => (
        <div
          key={`${koi.id}-${index}`}
          className="koi-card m-2 transform overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105"
        >
          <div className="flex gap-10">
            <Link
              to={`/kois/${koi.id}`}
              className="image-container flex w-[35%] bg-[#4086c7]"
            >
              {koi.thumbnail ? (
                <img
                  src={koi.thumbnail}
                  alt={koi.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </Link>
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
                  <span className="text-lg text-black">{koi.sex}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Age:</span>
                  <span className="text-lg text-black">
                    {koi.year_born} years
                  </span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Category:</span>
                  <span className="text-lg text-black">{koi.category_id}</span>
                </p>
              </div>
              {renderCrudButtons && (
                <div className="actions p-2 flex space-x-2">
                  {renderCrudButtons(koi)}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KoiCart;
