import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import NavigateButton from "../../components/shared/NavigateButton";
import { getKoiById } from "~/utils/apiUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faFish,
  faRuler,
  faCalendarDays,
  faListOl,
  faVenusMars,
  faUser,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { KoiDetailModel } from "./Kois";

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

export const KoiDetailItem: React.FC<KoiDetailItemProps> = ({
  icon,
  label,
  value,
  fontSize = "text-2xl",
  bgColor = "bg-gray-100",
  textColor = "text-black",
}) => {
  return (
    <div
      className={`${bgColor} m-2 grid grid-cols-2 rounded-3xl border border-gray-300 p-3`}
    >
      <div className="flex items-center">
        <FontAwesomeIcon icon={icon as IconDefinition} color="#d66b56" />
        <p className={`ml-2 text-lg`}>{label}</p>
      </div>
      <p className={`${fontSize} text-end ${textColor}`}>{value}</p>
    </div>
  );
};

const KoiDetail: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [koi, setKoi] = useState<KoiDetailModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchKoiData = async () => {
      try {
        const response = await getKoiById(parseInt(id || ""));

        // Check if the response is valid
        if (!response) {
          // If Koi is not found, navigate to Not Found page
          navigate("/notfound");
        } else {
          setKoi(response);
        }
      } catch (error) {
        console.error("Error fetching koi data:", error);
      }
    };

    fetchKoiData();
  }, [id]);

  if (!koi) {
    return null;
  }

  return (
    <div className="container mx-auto">
      <div className="ml-10 mt-6">
        <NavigateButton
          to="/kois"
          icon={<FontAwesomeIcon icon={faArrowLeft} />}
          text="Back to Koi List"
          className="rounded bg-gray-200 px-5 py-3 text-lg text-black transition hover:bg-gray-200"
        />
      </div>
      <div className="m-5 flex flex-col gap-6 p-4 sm:flex-col md:flex-row">
        {/* Koi Image */}
        <>
          <div className="relative h-96 w-full rounded-xl bg-[#4086c7] sm:h-128 md:h-144 md:w-128 lg:h-192">
            <img
              className="absolute inset-0 h-full w-full rounded-xl object-contain shadow-md transition duration-300 hover:shadow-2xl hover:ring-4 hover:ring-blue-400"
              src={koi.thumbnail}
              alt={koi.name}
            />
          </div>
          {/* Koi Info */}
          <div className="koi-info w-full space-y-4 rounded-2xl bg-gray-200 p-4 text-lg">
            <div className="mb-4 items-center rounded-2xl">
              <div className="grid w-full grid-cols-1 xl:grid-cols-2">
                <h2 className="col-span-1 m-4 text-4xl font-bold xl:col-span-2">
                  {koi.name}
                </h2>
                <KoiDetailItem
                  icon={faVenusMars}
                  label="Sex"
                  value={koi.sex}
                  bgColor="bg-gray-300"
                />
                <KoiDetailItem
                  icon={faRuler}
                  label="Length"
                  value={koi.length}
                  bgColor="bg-gray-300"
                />
                <KoiDetailItem
                  icon={faCalendarDays}
                  label="Age"
                  value={koi.age}
                  bgColor="bg-gray-300"
                />
                <KoiDetailItem
                  icon={faFish}
                  label="Category ID"
                  value={koi.category_id}
                  bgColor="bg-gray-300"
                />
              </div>
            </div>

            <div className="mb-4 flex flex-col items-center justify-between rounded-2xl md:flex-row">
              <div className="grid w-full grid-cols-1 lg:grid-cols-2">
                <KoiDetailItem
                  icon={faListOl}
                  label="Status"
                  value={koi.status_name}
                  {...getStatusStyles(koi.status_name)}
                />
                <KoiDetailItem
                  icon={faUser}
                  label="Owner ID"
                  value={koi.owner_id}
                  bgColor="bg-gray-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 grid-rows-3 rounded-2xl">
              <h2 className="col-span-2 row-span-1 m-4 text-4xl font-bold">
                Description
              </h2>
              <p className="col-span-2 row-span-2 m-4 text-2xl">
                {koi.description}
              </p>
            </div>
          </div>
        </>
        {/* Navigate Button */}
      </div>
    </div>
  );
};

export default KoiDetail;
