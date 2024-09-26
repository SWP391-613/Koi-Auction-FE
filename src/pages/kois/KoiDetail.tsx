import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import NavigateButton from "../../components/shared/NavigateButton";
import axios from "axios";
import { KoiDetailModel } from "./Koi.model";
import { getKoiById } from "~/utils/apiUtils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faFish, faRuler, faCalendarDays, faListOl, faVenusMars, faUser } from '@fortawesome/free-solid-svg-icons';

interface KoiDetailItemProps {
  icon: IconDefinition;
  label: string;
  value: string | number;
  fontSize?: string;
  bgColor?: string;
  textColor?: string;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "VERIFIED":
      return { bgColor: "bg-green-500", textColor: "text-white font-bold" };
    case "SOLD":
      return { bgColor: "bg-red-500", textColor: "text-black font-bold" };
    case "UNVERIFIED":
      return { bgColor: "bg-yellow-500", textColor: "text-black font-bold" };
    default:
      return { bgColor: "bg-gray-500", textColor: "text-black font-bold" };
  }
};

const KoiDetailItem: React.FC<KoiDetailItemProps> = ({
  icon,
  label,
  value,
  fontSize = 'text-2xl',
  bgColor = 'bg-gray-100',
  textColor = 'text-black'
}) => {
  return (
    <div className={`${bgColor} grid grid-cols-2 border border-gray-300 rounded-3xl p-3 m-2`}>
      <div className="flex items-center">
        <FontAwesomeIcon icon={icon as IconDefinition} color="#d66b56" />
        <p className={`text-lg ml-2`}>{label}</p>
      </div>
      <p className={`${fontSize} text-end ${textColor}`}>{value}</p>
    </div>
  );
};

const KoiDetail: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [koi, setKoi] = useState<KoiDetailModel | null>(null);

  useEffect(() => {
    const fetchKoiData = async () => {
      try {
        const response = await getKoiById(parseInt(id || ""));
        setKoi(response);
      } catch (error) {
        console.error("Error fetching koi data:", error);
      }
    };

    fetchKoiData();
  }, [id]);

  if (!koi) {
    return <div className="py-8 text-center">Không tìm thấy cá Koi.</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="mt-6 ml-10">
        <NavigateButton
          to="/kois"
          text="<-- Back to Koi List"
          className="text-black text-lg py-3 px-5 rounded transition bg-transparent hover:bg-gray-200"
        />
      </div>
      <div className="m-5 flex flex-col md:flex-row sm:flex-col p-4 gap-6">
        {/* Koi Image */}
        <>
          <div className="w-full h-96 sm:h-128 md:w-128 md:h-144 lg:h-192 relative bg-[#4086c7] rounded-xl">
            <img
              className="absolute inset-0 w-full h-full
              object-contain rounded-xl shadow-md
              transition hover:shadow-2xl hover:ring-4 hover:ring-blue-400 duration-300"
              src={koi.thumbnail}
              alt={koi.name}
            />
          </div>
          {/* Koi Info */}
          <div className="koi-info space-y-4 text-lg bg-gray-200 p-4 rounded-2xl w-full">
            <div className="items-center mb-4 rounded-2xl">
              <div className="w-full grid grid-cols-1 xl:grid-cols-2">
                <h2 className="text-4xl font-bold col-span-1 xl:col-span-2 m-4">{koi.name}</h2>
                <KoiDetailItem icon={faVenusMars} label="Sex" value={koi.sex} bgColor="bg-gray-300" />
                <KoiDetailItem icon={faRuler} label="Length" value={koi.length} bgColor="bg-gray-300" />
                <KoiDetailItem icon={faCalendarDays} label="Age" value={koi.age} bgColor="bg-gray-300" />
                <KoiDetailItem icon={faFish} label="Category ID" value={koi.category_id} bgColor="bg-gray-300" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-4 rounded-2xl">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2">
                <KoiDetailItem icon={faListOl} label="Status" value={koi.status_name}
                  {...getStatusStyles(koi.status_name)}
                />
                <KoiDetailItem icon={faUser} label="Owner ID" value={koi.owner_id} bgColor="bg-gray-300" />
              </div>
            </div>
            <div className="grid grid-cols-2 grid-rows-3 rounded-2xl">
              <h2 className="text-4xl font-bold col-span-2 row-span-1 m-4">Description</h2>
              <p className="text-2xl col-span-2 row-span-2 m-4">{koi.description}</p>
            </div>
          </div>
        </>
        {/* Navigate Button */}
      </div>
    </div>

  );
};

export default KoiDetail;
