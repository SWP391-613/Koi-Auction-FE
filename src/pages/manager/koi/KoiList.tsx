import React from "react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Container, Typography, CircularProgress, Alert } from "@mui/material";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import PaginationComponent from "../../../components/pagination/Pagination";
import { Koi, KoiApiResponse } from "~/types/KoiDTO";

const KoiList = () => {
  const [kois, setKois] = useState<Koi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 3; // Adjusted to match the API limit parameter

  const fetchKois = useCallback(async () => {
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

      if (data && Array.isArray(data.items)) {
        setKois(data.items);
        setTotalPages(data.total_page);
      } else {
        setError("Unexpected data structure from API");
      }
    } catch (err: any) {
      setError("Error fetching kois: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [page, itemsPerPage]);

  useEffect(() => {
    fetchKois();
  }, [fetchKois]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleView = (id: number) => {
    console.log("View koi", id);
    // Implement navigation or modal display as needed
  };

  const handleEdit = (id: number) => {
    console.log("Edit koi", id);
    // Implement edit functionality as needed
  };

  const handleDelete = (id: number) => {
    console.log("Delete koi", id);
    // Implement delete functionality as needed
  };

  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [newKoi, setNewKoi] = useState<Partial<Koi>>({
    name: "",
    sex: "",
    length: 0,
    age: 0,
  });
  const [koiImage, setKoiImage] = useState<File | null>(null);
  const handleOpenCreateDialog = () => setOpenCreateDialog(true);
  const handleCloseCreateDialog = () => setOpenCreateDialog(false);

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
          newKoi[key as keyof Partial<Koi>]?.toString() || "",
        );
      });
      if (koiImage) {
        formData.append("image", koiImage);
      }

      const response = await axios.post<Koi>(
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
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div>
          <Typography variant="h4" gutterBottom>
            Koi List
          </Typography>
        </div>
        <div className="my-2 flex flex-col sm:flex-row">
          <div className="relative block">
            <span className="absolute inset-y-0 left-0 flex h-full items-center pl-2">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current text-gray-500"
              >
                <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
              </svg>
            </span>
            <input
              placeholder="Search"
              className="block w-full appearance-none rounded-l rounded-r border border-b border-gray-400 bg-white py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 focus:bg-white focus:text-gray-700 focus:placeholder-gray-600 focus:outline-none sm:rounded-l-none"
              // Implement search functionality as needed
            />
          </div>
        </div>
        <div className="-mx-4 overflow-hidden px-4 py-4 sm:-mx-8 sm:px-8">
          <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Koi
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {kois.length > 0 ? (
                  kois.map((koi) => (
                    <tr key={koi.id}>
                      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-full w-full rounded-full object-cover"
                              src={koi.thumbnail}
                              alt={koi.name}
                            />
                          </div>
                          <div className="ml-3">
                            <p className="whitespace-no-wrap text-gray-900">
                              {koi.name || "N/A"}
                            </p>
                          </div>
                        </div>
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
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(koi.id)}
                            className="bg-blue-200 text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="View"
                          >
                            {/* View Icon */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEdit(koi.id)}
                            className="bg-blue-200 text-green-600 hover:text-green-900 p-1 rounded"
                            title="Edit"
                          >
                            {/* Edit Icon */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(koi.id)}
                            className="bg-blue-200 text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete"
                          >
                            {/* Delete Icon */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
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
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenCreateDialog}
        className="mb-4"
      >
        Create New Koi
      </Button>
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
    </div>
  );
};

export default KoiList;
