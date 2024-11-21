import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCalendarDays,
  faFish,
  faListOl,
  faPencilAlt,
  faRuler,
  faUser,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { KoiDetailItem } from "~/components/koibiddingdetail/KoiBiddingDetailComponent";
import { KoiDetailModel } from "~/types/kois.type";
import { getStatusColor } from "~/utils/colorUtils";
import { formatCurrency } from "~/utils/currencyUtils";
import { getCategoryName } from "~/utils/dataConverter";
import { useAuth } from "../../contexts/AuthContext";
import BreederEditKoiDialog from "./BreederEditKoiDialog";
import { getUserCookieToken, isTokenValid } from "~/utils/auth.utils";
import { fetchKoiById } from "~/apis/koi.apis";
import LoadingComponent from "~/components/shared/LoadingComponent";
import { useUserData } from "~/hooks/useUserData";

interface KoiDetailItemProps {
  icon: IconDefinition;
  label: string;
  value: string | number;
  fontSize?: string;
  bgColor?: string;
  textColor?: string;
}

const KoiDetail: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { user, loading: userLoading, error, setUser } = useUserData();
  const { id } = useParams<{ id: string }>();
  const [koi, setKoi] = useState<KoiDetailModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedKoiId, setSelectedKoiId] = useState<number | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const navigate = useNavigate();
  const token = getUserCookieToken();
  useEffect(() => {
    if (!token) navigate("/notfound");

    const fetchKoiData = async () => {
      try {
        console.log("data: " + user);
        const response = await fetchKoiById(parseInt(id || ""));

        if (!response) {
          navigate("/notfound");
        } else {
          setKoi(response);
          setSelectedKoiId(response.id);
        }
      } catch (error) {
        console.error("Error fetching koi data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKoiData();
  }, [id, token, navigate]);

  const handleEdit = useCallback(() => {
    setOpenEditDialog(true);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setOpenEditDialog(false);
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  if (!koi || !selectedKoiId) {
    return null;
  }

  return (
    <div className="container mx-auto">
      <div className="m-5 flex flex-col gap-6 p-4 sm:flex-col md:flex-row">
        {/* Koi Image */}
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
            <div className="flex justify-between items-center">
              <h2 className="m-4 text-4xl font-bold">{koi.name}</h2>
              {isTokenValid() &&
                koi.status_name === "UNVERIFIED" &&
                user &&
                user.role_name !== "breeder" && ( // Check if token is valid
                  <button
                    onClick={handleEdit}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="mr-2" />
                    Edit
                  </button>
                )}
            </div>
            {isTokenValid() && ( // Check if token is valid
              <KoiDetailItem
                icon={faListOl}
                label="Status"
                value={koi.status_name}
                className={getStatusColor(koi.status_name)}
              />
            )}
            <div className="grid w-full grid-cols-1 xl:grid-cols-2">
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
                label="Year Born"
                value={koi.year_born}
                bgColor="bg-gray-300"
              />
              <KoiDetailItem
                icon={faFish}
                label="Category ID"
                value={
                  koi.category_id ? getCategoryName(koi.category_id) : "Not Set"
                }
                bgColor="bg-gray-300"
              />
              <KoiDetailItem
                icon={faFish}
                label="Base Price"
                value={
                  koi.base_price ? formatCurrency(koi.base_price) : "Not Set"
                }
                bgColor="bg-gray-300"
              />
              <KoiDetailItem
                icon={faFish}
                label="Is Display"
                value={koi.is_display == 1 ? "Yes" : "No"}
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

        {koi.status_name === "UNVERIFIED" && openEditDialog && (
          <BreederEditKoiDialog
            open={openEditDialog}
            onClose={handleCloseEditDialog}
            koiId={selectedKoiId}
          />
        )}
      </div>
    </div>
  );
};

export default KoiDetail;
