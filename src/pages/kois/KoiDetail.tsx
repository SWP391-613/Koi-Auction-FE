import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import NavigateButton from "../../components/shared/NavigateButton";
import axios from "axios";
import { KoiDetailModel } from "./Koi.model";
import { getKoiById } from "~/utils/apiUtils";

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
    <>
      <div className=" bg-[#F1F1F1] m-5 flex flex-col md:flex-row p-4 gap-6">
        {/* Koi Header */}
        <div className="koi-header flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">{koi.name}</h1>
          <img
            className="w-3/4 h-3/4 object-cover rounded-lg shadow-md transition hover:shadow-2xl hover:scale-105 hover:brightness-110 hover:ring-4 hover:ring-blue-400 duration-300"
            src={koi.thumbnail}
            alt={koi.name}
          />
        </div>

        {/* Koi Info */}
        <div className="koi-info space-y-4 text-lg">
          <p>
            <strong>Sex:</strong> {koi.sex}
          </p>
          <p>
            <strong>Length:</strong> {koi.length} cm
          </p>
          <p>
            <strong>Age:</strong> {koi.age} years
          </p>
          <p>
            <strong>Status:</strong> {koi.status_name}
          </p>
          <p>
            <strong>Description:</strong> {koi.description}
          </p>
          <p>
            <strong>Owner ID:</strong> {koi.owner_id}
          </p>
          <p>
            <strong>Category ID:</strong> {koi.category_id}
          </p>
        </div>
      </div>

      {/* Navigate Button */}
      <div className="mt-6">
        <NavigateButton
          to="/kois"
          text="Back to Koi List"
          className="bg-blue-500 text-white py-3 px-5 rounded hover:bg-blue-600 transition hover:shadow-lg"
        />
      </div>
    </>
  );
};

export default KoiDetail;
