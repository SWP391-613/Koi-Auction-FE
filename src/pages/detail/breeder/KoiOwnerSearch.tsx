import { Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import KoiOwnerSearchComponent from "~/components/search/KoiOwnerSearchComponent";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import { API_URL_DEVELOPMENT } from "~/constants/endPoints";
import { useAuth } from "~/contexts/AuthContext";
import { environment } from "~/environments/environment";
import { KoiDetailModel } from "~/types/kois.type";
import { fetchKoisOfBreeder } from "~/utils/apiUtils";
import { getCookie } from "~/utils/cookieUtils";
import { extractErrorMessage } from "~/utils/dataConverter";

const KoiOwnerSearch: React.FC = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { isLoggedIn } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [kois, setKois] = useState<KoiDetailModel[]>([]);
  const [totalKoi, setTotalKoi] = useState(0); // State to hold total koi count
  const [hasMorePages, setHasMorePages] = useState(true);
  const handleSearchStateChange = (isActive: boolean) => {
    setIsSearchActive(isActive);
  };

  const itemsPerPage = 16; // Number of koi per page
  const userId = getCookie("user_id");
  const accessToken = getCookie("access_token");

  const renderCrudButtons = (koi: KoiDetailModel) => (
    <>
      <CrudButton
        onClick={() => handleEdit(koi.id)}
        ariaLabel="Edit"
        svgPath="edit.svg"
      />
      <CrudButton
        onClick={() => handleDelete(koi.id)}
        ariaLabel="Delete"
        svgPath="delete.svg"
      />
    </>
  );

  const fetchKoiData = async () => {
    if (!userId || !accessToken) return;

    try {
      const API_URL_DEVELOPMENT =
        import.meta.env.VITE_API_BASE_URL + environment.be.apiPrefix;
      const response = await fetchKoisOfBreeder(
        parseInt(userId),
        currentPage - 1,
        itemsPerPage,
        accessToken,
      );

      if (response) {
        setKois(response.item);
        setTotalKoi(response.total_item);
        setHasMorePages(response.item.length === itemsPerPage);
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        "Failed to fetch koi data",
      );
      toast.error(errorMessage);
      console.error("Không thể lấy dữ liệu cá Koi:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userId && accessToken) {
      fetchKoiData();
    }
  }, [currentPage, isLoggedIn, userId, accessToken]);

  const handleEdit = (id: number) => {
    navigate(`/kois/${id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this koi?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${API_URL_DEVELOPMENT}/kois/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        toast.success("Your Koi deleted successfully");
        setCurrentPage(1);
        fetchKoiData();
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Failed to delete koi.");
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="">
        <Typography variant="h5">Total: {totalKoi} koi</Typography>
      </div>
      <KoiOwnerSearchComponent
        onSearchStateChange={handleSearchStateChange}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        renderActions={renderCrudButtons}
      />
    </div>
  );
};

export default KoiOwnerSearch;
