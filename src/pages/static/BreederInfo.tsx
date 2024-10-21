import React from "react";
import { useParams } from "react-router-dom";
import { koiBreeders } from "../../utils/data/koibreeders";

const BreederInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const breederId = parseInt(id || "0", 10);
  const breeder = koiBreeders[breederId];

  if (!breeder) {
    return <div>Breeder not found</div>;
  }

  return (
    <div className="container mx-auto mt-8 px-4 mb-8">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center">
          <img
            src={breeder.avatar_url}
            alt={`${breeder.name} logo`}
            className="mr-4 h-20 w-20"
          />
          <h1 className="text-3xl font-bold">{breeder.name}</h1>
        </div>
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">About {breeder.name}</h2>
          <p className="text-gray-700">
            {breeder.name} is a renowned koi breeder known for their exceptional
            quality and unique varieties. They have been in the business for
            many years, consistently producing award-winning koi.
          </p>
        </div>
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">Specialties</h2>
          <ul className="list-inside list-disc text-gray-700">
            <li>High-quality Kohaku</li>
            <li>Rare Showa varieties</li>
            <li>Champion Sanke bloodlines</li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-xl font-semibold">Contact Information</h2>
          <p className="text-gray-700">
            Email: info@{breeder.name.toLowerCase()}.com
          </p>
          <p className="text-gray-700">Phone: +81 XXX-XXX-XXXX</p>
        </div>
      </div>
    </div>
  );
};

export default BreederInfo;
