import { Alert, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import LoadingComponent from "~/components/shared/LoadingComponent";
import TableHeaderComponent from "~/components/shared/TableHeaderComponent";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "~/constants/message";
import { BREEDER_KOI_MANAGEMENT_HEADER } from "~/constants/tableHeader";
import { BidMethod } from "~/types/auctionkois.type";
import { KoiDetailModel } from "~/types/kois.type";
import { getUserCookieToken } from "~/utils/auth.utils";
import { getCookie } from "~/utils/cookieUtils";
import { extractErrorMessage, getCategoryName } from "~/utils/dataConverter";
import PaginationComponent from "../../../components/common/PaginationComponent";
import AuctionKoiPopup from "./AuctionKoiPopup";
import { fetchKoisOfBreederWithStatus } from "~/apis/users/breeder.apis";
import { postAuctionKoi, revokeKoiFromAuction } from "~/apis/auctionkoi.apis";
import { deleteKoiById } from "~/apis/koi.apis";
import { formatCurrency } from "~/utils/currencyUtils";

interface BreederKoiManagementProps {
  auction_id: number;
  onKoiRegistered?: () => void;
}

const BreederKoiManagement: React.FC<BreederKoiManagementProps> = ({
  auction_id,
  onKoiRegistered,
}) => {
  const [kois, setKois] = useState<KoiDetailModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const navigate = useNavigate();
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 8; // Adjusted to match the API limit parameter
  const [selectedKoiId, setSelectedKoiId] = useState<number | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const accessToken = getUserCookieToken();
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
          page,
          itemsPerPage,
        ); // Use the utility function
        const data = koiData;

        if (data && Array.isArray(data.item)) {
          setKois(data.item);
          setTotalItems(data.total_item);
          setTotalPages(data.total_page);
        } else {
          throw new Error("Unexpected data structure from API");
        }
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          ERROR_MESSAGE.FETCH_KOI_ERROR,
        );
        setError(errorMessage); // Set error state
        toast.error(errorMessage); // Notify user of the error
      } finally {
        setLoading(false); // Reset loading state
      }
    };
    fetchKois();
  }, [page, itemsPerPage, accessToken, userId]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleView = (id: number) => {
    navigate(`/kois/${id}`);
  };

  const handlePush = (id: number) => {
    setSelectedKoiId(id);
    setOpenPopup(true);
  };

  const handlePopupSubmit = async (
    basePrice: number,
    bidStep: number,
    bidMethod: BidMethod,
    ceilPrice: number,
  ) => {
    if (!selectedKoiId || !auction_id) {
      toast.error(ERROR_MESSAGE.SELECT_KOI_AND_AUCTION);
      return;
    }

    try {
      const result = await postAuctionKoi(
        selectedKoiId,
        auction_id, //the props passed from KoiRegisterAuctionDetail.tsx
        basePrice,
        bidStep,
        bidMethod,
        ceilPrice,
        accessToken,
      );
      toast.success(SUCCESS_MESSAGE.REGISTER_KOI_SUCCESS);
      setOpenPopup(false);

      // Refresh the koi list
      const koiData = await fetchKoisOfBreederWithStatus(
        parseInt(userId),
        page,
        itemsPerPage,
      );
      if (koiData && Array.isArray(koiData.item)) {
        setKois(koiData.item);
        setTotalPages(koiData.total_page);
      }

      // Add delay before calling the callback
      setTimeout(() => {
        onKoiRegistered?.();
      }, 5000); // 5 second delay
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        ERROR_MESSAGE.REGISTER_KOI_FAILED,
      );
      toast.error(errorMessage);
    }
  };

  const handleRevokeKoi = async (koi_id: number, auction_id: number) => {
    const confirmed = window.confirm(
      `Are you sure you want to revoke koi id ${koi_id} from auction: ${auction_id}, this action cannot be undo, please take serious`,
    );
    if (!confirmed) return;
    try {
      const response = await revokeKoiFromAuction(koi_id, auction_id);
      if (response.status_code === 200) {
        toast.success(SUCCESS_MESSAGE.REVOKE_KOI_FROM_AUCTION_SUCCESS);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete koi: ${id}?`,
    );
    if (!confirmed) return;

    try {
      await deleteKoiById(id); // Use the utility function
      toast.success(SUCCESS_MESSAGE.DELETE_KOI_SUCCESS);
      setKois((prevKois) => prevKois.filter((koi) => koi.id !== id)); // Update state
    } catch (err: any) {
      const errorMessage = extractErrorMessage(
        err,
        ERROR_MESSAGE.DELETE_KOI_FAILED,
      );
      toast.error(errorMessage); // Notify user of the error
      setError(errorMessage); // Set error state
    }
  };

  if (loading) {
    return (
      <Container className="flex justify-center items-center h-screen">
        <LoadingComponent />
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
    <div className="w-full overflow-x-auto p-10">
      <div>
        <Typography variant="h4" className="mb-4">
          Total koi not in auction: {totalItems}
        </Typography>
      </div>
      <div className="overflow-hidden px-4 py-4 sm:-mx-8 sm:px-8">
        <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
          <table className="min-w-full leading-normal">
            <TableHeaderComponent headers={BREEDER_KOI_MANAGEMENT_HEADER} />
            <tbody>
              {kois.length > 0 ? (
                kois.map((koi) => (
                  <tr key={koi.id}>
                    <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                      <p className="whitespace-no-wrap text-gray-900">
                        {koi.id || "N/A"}
                      </p>
                    </td>
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
                        {koi.year_born || "N/A"}
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
                        {formatCurrency(koi.base_price) || "N/A"}
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
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="border-b border-gray-200 bg-white px-5 py-5 text-lg text-center text-red-500"
                  >
                    No verified kois found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex gap-4 justify-center">
            <AuctionKoiPopup
              open={openPopup}
              onClose={() => setOpenPopup(false)}
              koiId={selectedKoiId ?? 0}
              auctionId={auction_id ?? 0}
              basePrice={
                kois.filter((koi) => koi.id === selectedKoiId)[0]?.base_price
              }
              onSubmit={handlePopupSubmit}
            />
          </div>
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
