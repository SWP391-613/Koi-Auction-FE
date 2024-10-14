import axios from "axios";
import React, { useEffect, useState } from "react";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import { useAuth } from "~/contexts/AuthContext";
import { environment } from "~/environments/environment";
import { KoiDetailModel } from "~/types/kois.type";
import { getCookie } from "~/utils/cookieUtils";
import KoiCart from "./KoiCart";
import { useNavigate } from "react-router-dom";

const VerifyKoiList: React.FC = () => {
  const userId = getCookie("user_id");
  const accessToken = getCookie("access_token");
  const [kois, setKois] = useState<KoiDetailModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleView = (id: number) => {
    navigate(`/kois/${id}`);
  };

  const handleApprove = (id: number) => {
    alert(`Edit koi with id: ${id}`);
  };

  const handleDecline = (id: number) => {
    alert(`Delete koi with id: ${id}`);
  };

  const fetchKoiData = async () => {
    if (!accessToken) {
      setError("No access token available");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const API_URL =
        import.meta.env.VITE_API_BASE_URL + environment.be.apiPrefix;
      const response = await axios.get(`${API_URL}/kois/status`, {
        params: {
          status: "UNVERIFIED",
        },
      });

      console.log("API response:", response.data);

      if (Array.isArray(response.data)) {
        setKois(response.data);
      } else {
        setError("Invalid data format received from API");
      }
    } catch (error) {
      console.error("Không thể lấy dữ liệu cá Koi:", error);
      setError("Failed to fetch Koi data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userId && accessToken) {
      fetchKoiData();
    }
  }, [currentPage, isLoggedIn, userId, accessToken]);

  console.log("Current state:", { isLoading, error, kois });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const renderCrudButtons = (koi: KoiDetailModel) => (
    <>
      <CrudButton
        onClick={() => handleView(koi.id)}
        ariaLabel="View"
        svgPath="view.svg"
      />
      <CrudButton
        onClick={() => handleApprove(koi.id)}
        ariaLabel="Approve"
        svgPath="approve.svg"
      />
      <CrudButton
        onClick={() => handleDecline(koi.id)}
        ariaLabel="No Approve"
        svgPath="notapprove.svg"
      />
    </>
  );

  return (
    <div>
      {kois.length > 0 ? (
        <KoiCart
          items={kois}
          handleView={handleView}
          handleEdit={handleApprove}
          handleDelete={handleDecline}
          renderCrudButtons={renderCrudButtons}
        />
      ) : (
        <div>No Koi data available</div>
      )}
    </div>
  );
};

export default VerifyKoiList;
