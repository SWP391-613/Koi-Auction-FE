import {
  Alert,
  Button,
  CircularProgress,
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
import { DeleteIcon } from "~/components/icons/DeleteIcon";
import { EditIcon } from "~/components/icons/EditIcon";
import { ViewIcon } from "~/components/icons/ViewIcon";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import { KoiApiResponse, KoiDetailModel } from "~/types/kois.type";
import PaginationComponent from "../../../components/pagination/Pagination";
import EditKoiDialog from "./EditKoiDialog";

const KoiManagement = () => {
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

  useEffect(() => {
    const fetchKois = async () => {
      try {
        setLoading(true);
        const response = await axios.get<KoiApiResponse>(
          "http://localhost:4000/api/v1/kois",
          {
            params: {
              page: page - 1, // Assuming the API is zero-based
              limit: itemsPerPage,
            },
          },
        );

        const data = response.data;

        if (data && Array.isArray(data.item)) {
          setKois(data.item);
          setTotalPages(data.total_page);
        } else {
          setError("Unexpected data structure from API");
        }
      } catch (err: any) {
        setError("Error fetching kois: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
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

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete koi: ${id}?`,
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:4000/api/v1/kois/${id}`);
      toast.success("Koi deleted successfully!");
      setKois(kois.filter((koi) => koi.id !== id));
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.reason);
      }
      setError("Error deleting koi: " + (err.message || "Unknown error"));
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
      const formData = new FormData();
      Object.keys(newKoi).forEach((key) => {
        formData.append(
          key,
          newKoi[key as keyof Partial<KoiDetailModel>]?.toString() || "",
        );
      });
      if (koiImage) {
        formData.append("image", koiImage);
      }

      const response = await axios.post<KoiDetailModel>(
        "http://localhost:4000/api/v1/kois",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setKois([...kois, response.data]);
      handleCloseCreateDialog();
      setKoiImage(null);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.reason);
      }
      setError("Error creating koi: " + (err.message || "Unknown error"));
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
      <div className="">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" gutterBottom>
            Koi List
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenCreateDialog}
            className="mb-4"
          >
            Create New Koi
          </Button>
        </div>
        <div className="-mx-4 overflow-hidden px-4 py-4 sm:-mx-8 sm:px-8">
          <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Id
                  </th>
                  <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Name
                  </th>
                  <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Sex
                  </th>
                  <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Length (cm)
                  </th>
                  <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Age
                  </th>
                  <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Koi
                  </th>
                  <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Base Price
                  </th>
                  <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Status
                  </th>
                  <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Display
                  </th>

                  <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Owner ID
                  </th>
                  <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Category ID
                  </th>
                  <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
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
                          {koi.is_display || "N/A"}
                        </p>
                      </td>
                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p className="whitespace-no-wrap text-gray-900">
                          {koi.owner_id || "N/A"}
                        </p>
                      </td>
                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <p className="whitespace-no-wrap text-gray-900">
                          {koi.category_id || "N/A"}
                        </p>
                      </td>

                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <div className="flex items-center space-x-2">
                          <CrudButton
                            onClick={() => handleView(koi.id)}
                            ariaLabel="View"
                            svg={<ViewIcon size={20} />}
                          />
                          <CrudButton
                            onClick={() => handleEdit(koi.id)}
                            ariaLabel="Edit"
                            svg={<EditIcon size={20} />}
                          />
                          <CrudButton
                            onClick={() => handleDelete(koi.id)}
                            ariaLabel="Delete"
                            svg={<DeleteIcon size={20} />}
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
                  <EditKoiDialog
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
        <DialogTitle>Create New Koi</DialogTitle>
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
            label="Age"
            type="number"
            fullWidth
            variant="standard"
            value={newKoi.age}
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