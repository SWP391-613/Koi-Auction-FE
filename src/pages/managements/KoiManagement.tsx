import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import LoadingComponent from "~/components/shared/LoadingComponent";
import TableHeaderComponent from "~/components/shared/TableHeaderComponent";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import { KOI_MANAGEMENT_HEADER } from "~/constants/tableHeader";
import {
  KoiDetailModel,
  QuantityKoiByGenderResponse,
  QuantityKoiByStatusResponse,
} from "~/types/kois.type";
import { getUserCookieToken } from "~/utils/auth.utils";
import { formatCurrency } from "~/utils/currencyUtils";
import { createFormData, extractErrorMessage } from "~/utils/dataConverter";
import PaginationComponent from "../../components/common/PaginationComponent";
import BreederEditKoiDialog from "../kois/BreederEditKoiDialog";
import { createKoi, deleteKoiById, getKoiData } from "~/apis/koi.apis";
import {
  CONFIRMATION_MESSAGE,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
} from "~/constants/message";

const KoiManagement = () => {
  const [kois, setKois] = useState<KoiDetailModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const navigate = useNavigate();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 20; // Adjusted to match the API limit parameter
  const [selectedKoiId, setSelectedKoiId] = useState<number | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [newKoi, setNewKoi] = useState<Partial<KoiDetailModel>>({
    name: "",
    sex: "",
    length: 0,
    year_born: 0,
  });
  const [koiImage, setKoiImage] = useState<File | null>(null);
  const [koiCountGender, setKoiCountGender] =
    useState<QuantityKoiByGenderResponse | null>(null);
  const [koiCountStatus, setKoiCountStatus] =
    useState<QuantityKoiByStatusResponse | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const handleSearchStateChange = (isActive: boolean) => {
    setIsSearchActive(isActive);
  };

  const accessToken = getUserCookieToken();
  // Handle access token early return
  useEffect(() => {
    if (!accessToken) {
      navigate("/notfound");
    }
  }, [accessToken, navigate]);

  if (!accessToken) return null;

  useEffect(() => {
    const fetchKois = async () => {
      setLoading(true); // Set loading state to true
      try {
        const koiData = await getKoiData(page, itemsPerPage); // Use the utility function
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

    const fetchKoiGenderCount = async () => {
      setLoading(true);
      try {
        const response = await axios.get<QuantityKoiByGenderResponse>(
          `${DYNAMIC_API_URL}/kois/count-by-gender`,
        );
        setKoiCountGender(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    //http://localhost:4000/api/v1/kois/count-by-status
    const fetchKoiStatusCount = async () => {
      try {
        const response = await axios.get(
          `${DYNAMIC_API_URL}/kois/count-by-status`,
        );
        setKoiCountStatus(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchKois();
    fetchKoiGenderCount();
    fetchKoiStatusCount();
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

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      `${CONFIRMATION_MESSAGE.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_KOI} ${id}?`,
    );
    if (!confirmed) return;

    try {
      await deleteKoiById(id); // Use the utility function
      toast.success(SUCCESS_MESSAGE.DELETE_KOI_SUCCESS);
      setKois((prevKois) => prevKois.filter((koi) => koi.id !== id)); // Update state
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      console.log(errorMessage);

      toast.error(errorMessage);
    }
  };

  const handleEdit = useCallback((id: number) => {
    setSelectedKoiId(id);
    setOpenEditDialog(true);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setOpenEditDialog(false);
    setSelectedKoiId(null);
  }, []);

  const handleOpenCreateDialog = useCallback(
    () => setOpenCreateDialog(true),
    [],
  );
  const handleCloseCreateDialog = useCallback(
    () => setOpenCreateDialog(false),
    [],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewKoi({ ...newKoi, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setKoiImage(event.target.files[0]);
    }
  };

  const handleCreateKoi = async () => {
    try {
      const formData = createFormData(newKoi, koiImage);

      const newKoiData = await createKoi(formData); // Use the utility function
      setKois((prevKois) => [...prevKois, newKoiData]); // Update state
      handleCloseCreateDialog();
      setKoiImage(null);
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err, "Error creating koi");
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
    <div className="m-5 overflow-x-auto">
      <div className="">
        <div className="mb-6 flex justify-between">
          <div className="flex gap-5">
            <div className="border-2 p-6 rounded-xl">
              <Typography variant="h5">
                Total: {koiCountGender?.total} koi
              </Typography>
              <Typography variant="body1">
                {" "}
                Male: {koiCountGender?.male}
              </Typography>
              <Typography variant="body1">
                {" "}
                Female: {koiCountGender?.female}
              </Typography>
              <Typography variant="body1">
                {" "}
                Unknown: {koiCountGender?.unknown}
              </Typography>
            </div>
            <div className="border-2 p-6 rounded-xl">
              <Typography variant="h5">
                Total: {koiCountStatus?.total} koi
              </Typography>
              <Typography variant="body1">
                Unverified: {koiCountStatus?.unverified}
              </Typography>
              <Typography variant="body1">
                Verified: {koiCountStatus?.verified}
              </Typography>
              <Typography variant="body1">
                Sold: {koiCountStatus?.sold}
              </Typography>
              <Typography variant="body1">
                Rejected: {koiCountStatus?.rejected}
              </Typography>
            </div>
          </div>
        </div>
        <div className="px-4 py-4 sm:-mx-8 sm:px-8">
          <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
            <table className="min-w-full leading-normal">
              <TableHeaderComponent headers={KOI_MANAGEMENT_HEADER} />
              <tbody>
                {kois.length > 0 ? (
                  kois.map((koi) => (
                    <tr key={koi.id}>
                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p className="whitespace-no-wrap text-gray-900">
                          {koi.id}
                        </p>
                      </td>

                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p className="whitespace-no-wrap text-gray-900">
                          {koi.name}
                        </p>
                      </td>
                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p className="whitespace-no-wrap text-gray-900">
                          {koi.sex}
                        </p>
                      </td>
                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p className="whitespace-no-wrap text-gray-900">
                          {koi.length}
                        </p>
                      </td>
                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p className="whitespace-no-wrap text-gray-900">
                          {koi.year_born}
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
                          {koi.base_price == 0
                            ? "N/A"
                            : formatCurrency(koi.base_price)}
                        </p>
                      </td>
                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p className="whitespace-no-wrap text-gray-900">
                          {koi.status_name}
                        </p>
                      </td>
                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p className="whitespace-no-wrap text-gray-900">
                          {koi.is_display}
                        </p>
                      </td>
                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p className="whitespace-no-wrap text-gray-900">
                          {koi.owner_id}
                        </p>
                      </td>
                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p className="whitespace-no-wrap text-gray-900">
                          {koi.category_id}
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
                            onClick={() => handleDelete(koi.id)}
                            ariaLabel="Delete"
                            svgPath="delete.svg"
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
                {selectedKoiId && (
                  <BreederEditKoiDialog
                    open={openEditDialog}
                    onClose={handleCloseEditDialog}
                    koiId={selectedKoiId}
                  />
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
      </div>
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
        <DialogTitle>Add New Koi</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={newKoi.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="sex"
            label="Sex"
            type="text"
            fullWidth
            variant="standard"
            value={newKoi.sex}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="length"
            label="Length (cm)"
            type="number"
            fullWidth
            variant="standard"
            value={newKoi.length}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="age"
            label="Year Born"
            type="number"
            fullWidth
            variant="standard"
            value={newKoi.year_born}
            onChange={handleInputChange}
          />
          <label
            htmlFor="koiImageUpload"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Upload Koi Image
          </label>
          <input
            id="koiImageUpload"
            type="file"
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            accept="image/*"
            aria-label="Upload Koi Image"
            onChange={handleFileChange}
            style={{ marginTop: "1rem" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button onClick={handleCreateKoi}>Create</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default KoiManagement;
