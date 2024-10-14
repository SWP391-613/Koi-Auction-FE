import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import { useAuth } from "~/contexts/AuthContext";
import { environment } from "~/environments/environment";
import { KoiDetailModel } from "~/types/kois.type";
import { getCookie } from "~/utils/cookieUtils";
import KoiCart from "./KoiCart";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { extractErrorMessage } from "~/utils/dataConverter";

const VerifyKoiList: React.FC = () => {
  const userId = getCookie("user_id");
  const accessToken = getCookie("access_token");
  const [kois, setKois] = useState<KoiDetailModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleView = (id: number) => {
    navigate(`/kois/${id}`);
  };

  const handleApprove = async (id: number) => {
    try {
      await axios.put(
        `http://localhost:4000/api/v1/kois/status/${id}`,
        {
          tracking_status: "VERIFIED",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      toast.success("Koi Approved successfully");
      // Remove the approved Koi from the list
      setKois((prevKois) => prevKois.filter((koi) => koi.id !== id));
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Failed to approve Koi");
      toast.error(errorMessage);
    }
  };

  const handleDecline = async (id: number) => {
    const confirmReject = confirm("Are you sure you want to reject this koi?");
    if (!confirmReject) return;

    try {
      await axios.put(
        `http://localhost:4000/api/v1/kois/status/${id}`,
        {
          tracking_status: "REJECTED",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      toast.success("Koi rejected");
      // Remove the rejected Koi from the list
      setKois((prevKois) => prevKois.filter((koi) => koi.id !== id));
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Failed to reject Koi");
      toast.error(errorMessage);
    }
  };

  const fetchKoiData = useCallback(async () => {
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
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (Array.isArray(response.data)) {
        setKois(response.data);
      } else {
        setError("Invalid data format received from API");
      }
    } catch (error) {
      console.error("Cannot fetch Koi data:", error);
      setError("Failed to fetch Koi data");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isLoggedIn && userId && accessToken) {
      fetchKoiData();
    }
  }, [isLoggedIn, userId, accessToken, fetchKoiData]);

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
