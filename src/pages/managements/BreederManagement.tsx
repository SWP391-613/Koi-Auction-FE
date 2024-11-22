import AddIcon from "@mui/icons-material/Add";
import { Alert, Button, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { softDeleteUser, undoDeleteUser } from "~/apis/user.apis";
import { fetchBreedersData } from "~/apis/users/breeder.apis";
import PaginationComponent from "~/components/common/PaginationComponent";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import LoadingComponent from "~/components/shared/LoadingComponent";
import TableHeaderComponent from "~/components/shared/TableHeaderComponent";
import {
  CONFIRMATION_MESSAGE,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
} from "~/constants/message";
import { BREEDER_MANAGEMENT_HEADER } from "~/constants/tableHeader";
import { Breeder } from "~/types/users.type";
import { extractErrorMessage } from "~/utils/dataConverter";
import AddBreederDialog from "../detail/breeder/AddBreederDialog";
import CustomButton from "~/components/shared/CustomButton";

const BreederManagement = () => {
  const [breeders, setBreeders] = useState<Breeder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchBreeders = async () => {
      setLoading(true);

      try {
        const data = await fetchBreedersData(page, itemsPerPage); // Use the utility function

        if (data && Array.isArray(data.item)) {
          setBreeders(data.item);
          setTotalItems(data.total_item);
          setTotalPages(data.total_page);
        } else {
          setError("Unexpected data structure from API");
        }
      } catch (err) {
        const errorMessage = extractErrorMessage(
          err,
          "Error fetching breeders",
        );
        toast.error(errorMessage); // Notify user of the error
        setError(errorMessage); // Set error state
      } finally {
        setLoading(false);
      }
    };

    fetchBreeders();
  }, [page, itemsPerPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleCreate = () => {
    setOpenAddDialog(true);
  };

  const handleEdit = (id: number) => {
    alert(`Edit breeder ${id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmReject = confirm(
      `${CONFIRMATION_MESSAGE.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_BREEDER} ${id}`,
    );
    if (!confirmReject) return;

    try {
      await softDeleteUser(id);
      toast.success(SUCCESS_MESSAGE.DELETE_BREEDER_SUCCESS);
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        ERROR_MESSAGE.DELETE_BREEDER_FAILED,
      );
      toast.error(errorMessage);
    }
  };

  const handleUndoDelete = async (id: number) => {
    const confirmReject = confirm(
      `${CONFIRMATION_MESSAGE.ARE_YOU_SURE_YOU_WANT_TO_REDO_THIS_BREEDER} ${id}`,
    );
    if (!confirmReject) return;

    try {
      await undoDeleteUser(id);
      toast.success(SUCCESS_MESSAGE.REDO_BREEDER_SUCCESS);
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        ERROR_MESSAGE.REDO_BREEDER_FAILED,
      );
      toast.error(errorMessage);
    }
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleInputChange = (name: string, value: unknown) => {};

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleEditInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingComponent />
      </div>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="m-5 overflow-x-auto">
      <div className="mb-6 flex justify-between">
        <div className="border-2 border-sky-500 p-6 rounded-xl">
          <Typography variant="h5">Total Breeders: {totalItems}</Typography>
        </div>
        <CustomButton onClick={handleCreate}>
      <AddIcon className="mr-2" />
      New Breeder
    </CustomButton>
      </div>

      <table className="whitespace-no-wrap w-full">
        <TableHeaderComponent headers={BREEDER_MANAGEMENT_HEADER} />
        <tbody className="divide-y bg-white dark:divide-gray-700 dark:bg-gray-800">
          {breeders.map((breeder) => (
            <tr key={breeder.id} className="text-gray-700 dark:text-gray-400">
              <td>
                <div className="px-4 py-3">
                  <p className="whitespace-no-wrap text-gray-900">
                    {breeder.id}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center text-sm">
                  <div className="relative mr-3 hidden h-[3rem] w-[3rem] rounded-full md:block">
                    <img
                      className="w-full rounded-full object-cover"
                      src={breeder.avatar_url}
                      alt=""
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0 rounded-full shadow-inner"
                      aria-hidden="true"
                    ></div>
                  </div>
                  <div>
                    <p className="font-semibold">{breeder.first_name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Breeder
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">{breeder.email}</td>
              <td className="px-4 py-3 text-sm">
                {breeder?.phone_number || "Not provided"}
              </td>
              <td className="px-4 py-3 text-sm">{breeder.address}</td>
              <td className="px-4 py-3 text-sm">{breeder.status_name}</td>
              <td className="px-4 py-3 text-sm">
                {breeder.is_active ? "Yes" : "No"}
              </td>
              <td className="px-4 py-3 text-sm">{breeder.is_subscription}</td>
              <td className="px-4 py-3 text-sm">{breeder.account_balance}</td>
              <td className="px-4 py-3 text-sm">{breeder.koi_count}</td>
              <td className="px-4 py-3 text-sm">{breeder.created_at}</td>
              <td className="px-4 py-3 text-sm">{breeder.updated_at}</td>
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center space-x-4 text-sm">
                  <CrudButton
                    onClick={() => handleDelete(breeder.id)}
                    ariaLabel="Delete breeder"
                    svgPath="delete.svg"
                  />

                  <CrudButton
                    onClick={() => handleUndoDelete(breeder.id)}
                    ariaLabel="Redo breeder"
                    svgPath="redo.svg"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="xs:flex-row xs:justify-between flex flex-col items-center border-t bg-white px-5 py-5">
        <PaginationComponent
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>

      <AddBreederDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        onInputChange={handleInputChange}
      />

      {/* <EditBreederDialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          editingAuction={editingAuction}
          handleEndAuction={handleEndAuction}
          onInputChange={handleEditInputChange}
          onSubmit={handleSubmitEditAuction}
          onEdit={handleEdit}
          onDelete={handleDelete}
        /> */}
    </div>
  );
};

export default BreederManagement;
