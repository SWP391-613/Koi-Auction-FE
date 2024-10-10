import React from "react";
import { Link } from "react-router-dom";
import { KoiDetailModel } from "~/types/kois.type";

interface KoiCartProps {
  items: KoiDetailModel[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const KoiCart: React.FC<KoiCartProps> = ({
  items,
  onView,
  onEdit,
  onDelete,
}) => {
  // useRedirectIfEmpty(items)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-500";
      case "UNVERIFIED":
        return "bg-yellow-500";
      case "SOLD":
        return "bg-red-500";
      case "REJECTED":
        return "bg-gray-500";
      case "PENDING":
        return "bg-blue-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="koi-container m-3 grid h-full grid-cols-1 gap-4 p-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {items.map((koi, index) => (
        <Link
          to={`/kois/${koi.id}`}
          key={`${koi.id}-${index}`}
          className="koi-card m-2 transform overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105"
        >
          <div className="flex flex-row">
            <div className="image-container flex w-3/6 bg-[#4086c7]">
              {koi.thumbnail ? (
                <img
                  src={koi.thumbnail}
                  alt={koi.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>
            <div className="ml-8 flex flex-col items-start">
              <div className="info p-4">
                <h2 className="title text-2xl font-semibold">{koi.name}</h2>
                <div
                  className={`status rounded-xl p-2 text-left text-white ${getStatusColor(koi.status_name)} text-md font-bold`}
                >
                  {koi.status_name}
                </div>
              </div>
              <div className="details p-2 text-sm text-gray-600">
                <p className="flex justify-between">
                  <span>Length:</span>
                  <span className="text-lg text-black">{koi.length} cm</span>
                </p>
                <p className="flex justify-between">
                  <span>Sex:</span>
                  <span className="text-lg text-black">{koi.sex}</span>
                </p>
                <p className="flex justify-between">
                  <span>Age:</span>
                  <span className="text-lg text-black">{koi.age} years</span>
                </p>
                <p className="flex justify-between">
                  <span>Category:</span>
                  <span className="text-lg text-black">{koi.category_id}</span>
                </p>
              </div>
              <div className="actions p-2 flex space-x-2">
                <button
                  onClick={() => onView(koi.id)}
                  className="bg-blue-200 text-blue-600 hover:text-blue-900 p-1 rounded"
                  title="View"
                >
                  {/* View Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onEdit(koi.id)}
                  className="bg-blue-200 text-green-600 hover:text-green-900 p-1 rounded"
                  title="Edit"
                >
                  {/* Edit Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(koi.id)}
                  className="bg-blue-200 text-red-600 hover:text-red-900 p-1 rounded"
                  title="Delete"
                >
                  {/* Delete Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default KoiCart;
