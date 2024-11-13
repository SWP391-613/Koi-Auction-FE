import React from "react";
import { KoiDetailModel } from "~/types/kois.type";

interface KoiCartProps {
  items: KoiDetailModel[];
}

export const KoiCartComponenet: React.FC<KoiCartProps> = ({ items }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Koi Cart</h2>
      {items.length === 0 ? (
        <p>No kois in the cart.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((koi) => (
            <li
              key={koi.id}
              className="flex items-center space-x-4 border-b pb-4"
            >
              <img
                src={koi.thumbnail}
                alt={koi.name}
                className="w-16 h-16 object-cover rounded-full"
              />
              <div>
                <h3 className="font-semibold">{koi.name}</h3>
                <p className="text-sm text-gray-600">
                  Sex: {koi.sex}, Age: {koi.year_born}, Length: {koi.length}cm
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
