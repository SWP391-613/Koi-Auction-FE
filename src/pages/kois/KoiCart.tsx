import React from "react";
import { Link } from "react-router-dom";
import { KoiDetailModel } from "./Koi.model";

interface KoiCartProps {
  items: KoiDetailModel[];
}

const KoiCart: React.FC<KoiCartProps> = ({ items }) => {
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

  if (!Array.isArray(items) || items.length === 0) {
    return <div>Không có dữ liệu cá Koi.</div>;
  }

  return (
    <div className="koi-container m-10 grid grid-cols-1 gap-4 p-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((koi) => (
        <Link
          to={`/koi/${koi.id}`}
          key={koi.id}
          className="koi-card transform overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105"
        >
          <div className="image-container flex h-48 w-full items-center justify-center bg-gray-200">
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
        </Link>
      ))}
    </div>
  );
};

export default KoiCart;
