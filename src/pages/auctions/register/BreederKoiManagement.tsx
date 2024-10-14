import { Alert, CircularProgress, Container } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import TableHeaderComponent from "~/components/shared/TableHeaderComponent";
import {
  BREEDER_KOI_MANAGEMENT_HEADER,
  KOI_MANAGEMENT_HEADER,
} from "~/constants/tableHeader";
import { KoiDetailModel } from "~/types/kois.type";
import {
  createKoi,
  deleteKoiById,
  fetchKoisOfBreederWithStatus,
} from "~/utils/apiUtils";
import { getCookie } from "~/utils/cookieUtils";
import {
  createFormData,
  extractErrorMessage,
  getCategoryName,
} from "~/utils/dataConverter";
import PaginationComponent from "../../../components/pagination/Pagination";

const BreederKoiManagement = () => {
  const [kois, setKois] = useState<KoiDetailModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const navigate = useNavigate();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 8; // Adjusted to match the API limit parameter
  const [selectedKoiId, setSelectedKoiId] = useState<number | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [newKoi, setNewKoi] = useState<Partial<KoiDetailModel>>({
    name: "",
    sex: "",
    length: 0,
    age: 0,
  });
  const [koiImage, setKoiImage] = useState<File | null>(null);

  const accessToken = getCookie("access_token");
  const userId = getCookie("user_id");
  // Handle access token early return
  useEffect(() => {
    if (!accessToken || !userId) {
      navigate("/notfound");
    }
  }, [accessToken, userId, navigate]);

  if (!accessToken || !userId) return null;

  useEffect(() => {
    const fetchKois = async () => {
      setLoading(true); // Set loading state to true
      try {
        const koiData = await fetchKoisOfBreederWithStatus(
          parseInt(userId),
          "VERIFIED",
          page - 1,
          itemsPerPage,
          accessToken,
        ); // Use the utility function
        const data = koiData;

        if (data && Array.isArray(data.item)) {
          setKois(data.item);
          setTotalPages(data.total_page);
        } else {
          throw new Error("Unexpected data structure from API");
        }
      } catch (error) {
        const errorMessage = extractErrorMessage(error, "Error fetching kois");
        setError(errorMessage); // Set error state
        toast.error(errorMessage); // Notify user of the error
      } finally {
        setLoading(false); // Reset loading state
      }
    };
    fetchKois();
  }, [page, itemsPerPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleView = (id: number) => {
    navigate(`/kois/${id}`);
  };

  const handlePush = async (id: number) => {
    alert(`Push koi: ${id}`);
  };

  const handleCancel = async (id: number) => {
    alert(`Cancel koi: ${id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete koi: ${id}?`,
    );
    if (!confirmed) return;

    try {
      await deleteKoiById(id, accessToken); // Use the utility function
      toast.success("Koi deleted successfully!");
      setKois((prevKois) => prevKois.filter((koi) => koi.id !== id)); // Update state
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err, "Error deleting koi");
      toast.error(errorMessage); // Notify user of the error
      setError(errorMessage); // Set error state
    }
  };

  if (loading) {
    return (
      <Container className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="-mx-4 overflow-hidden px-4 py-4 sm:-mx-8 sm:px-8">
        <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
          <table className="min-w-full leading-normal">
            <TableHeaderComponent headers={BREEDER_KOI_MANAGEMENT_HEADER} />
            <tbody>
              {kois.length > 0 ? (
                kois.map((koi) => (
                  <tr key={koi.id}>
                    <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                      <p className="whitespace-no-wrap text-gray-900">
                        {koi.name || "N/A"}
                      </p>
                    </td>
                    <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                      <p className="whitespace-no-wrap text-gray-900">
                        {koi.sex || "N/A"}
                      </p>
                    </td>
                    <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                      <p className="whitespace-no-wrap text-gray-900">
                        {koi.length || "N/A"}
                      </p>
                    </td>
                    <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                      <p className="whitespace-no-wrap text-gray-900">
                        {koi.age || "N/A"}
                      </p>
                    </td>
                    <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                      <div className="flex items-center">
                        <div className="h-30 w-10 flex-shrink-0">
                          <img
                            className="h-full w-full rounded-full object-cover"
                            src={koi.thumbnail}
                            alt={koi.thumbnail}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                      <p className="whitespace-no-wrap text-gray-900">
                        {koi.base_price || "N/A"}
                      </p>
                    </td>
                    <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                      <p className="whitespace-no-wrap text-gray-900">
                        {koi.status_name || "N/A"}
                      </p>
                    </td>
                    <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                      <p className="whitespace-no-wrap text-gray-900">
                        {getCategoryName(koi.category_id) || "N/A"}
                      </p>
                    </td>

                    <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                      <div className="flex items-center space-x-2">
                        <CrudButton
                          onClick={() => handleView(koi.id)}
                          ariaLabel="View"
                          svgPath="view.svg"
                        />
                        <CrudButton
                          onClick={() => handlePush(koi.id)}
                          ariaLabel="Push"
                          svgPath="approve.svg"
                        />
                        <CrudButton
                          onClick={() => handleCancel(koi.id)}
                          ariaLabel="Cancel"
                          svgPath="notapprove.svg"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="border-b border-gray-200 bg-white px-5 py-5 text-sm text-center text-gray-900"
                  >
                    No kois found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="xs:flex-row xs:justify-between flex flex-col items-center border-t bg-white px-5 py-5">
            <PaginationComponent
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BreederKoiManagement;
