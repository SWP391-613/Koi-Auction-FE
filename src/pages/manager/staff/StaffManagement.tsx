import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios, { Axios } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "~/components/pagination/Pagination";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import { Staff, StaffRegisterDTO, StaffsResponse } from "~/types/users.type";
import { getCookie } from "~/utils/cookieUtils";
import CreateStaffDialog from "./CreateStaffDialog";
import EditStaffDialog from "./EditStaffDialog";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import usePagination from "~/hooks/usePagination";
import { ENDPOINT_STAFFS } from "~/constants/endPoints";
import TableHeaderComponent from "~/components/shared/TableHeaderComponent";
import { STAFF_MANAGEMENT_HEADER } from "~/constants/tableHeader";
import { createStaff, deleteStaff } from "~/utils/apiUtils";
import { extractErrorMessage } from "~/utils/dataConverter";

const StaffManagement = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const navigate = useNavigate();
  const [newStaff, setNewStaff] = useState<StaffRegisterDTO>({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    is_active: true,
    is_subscription: true,
    address: "",
    date_of_birth: "",
    avatar_url: "",
  });

  const accessToken = getCookie("access_token");
  // Handle access token early return
  useEffect(() => {
    if (!accessToken) {
      navigate("/notfound");
    }
  }, [accessToken, navigate]);

  const {
    items: staffs,
    loading,
    error,
    page,
    totalPages,
    handlePageChange,
    refetch,
  } = usePagination<Staff>({
    apiUrl: ENDPOINT_STAFFS.BASE,
    itemsPerPage: 8,
    accessToken,
  });

  if (!accessToken) return null;

  const handleDelete = useCallback(
    async (id: number) => {
      const confirmed = window.confirm(
        `Are you sure you want to delete staff: ${id}?`,
      );
      if (!confirmed) return;

      try {
        await deleteStaff(id, accessToken); // Use the utility function for API call
        toast.success("Staff deleted successfully!");
        refetch(); // Refetch the data after successful deletion
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          "Failed to delete staff. Please try again.",
        );
        toast.error(errorMessage);
      }
    },
    [accessToken, refetch],
  );

  const handleEdit = useCallback((id: number) => {
    setSelectedStaffId(id);
    setOpenEditDialog(true);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setOpenEditDialog(false);
    setSelectedStaffId(null);
  }, []);

  const handleOpenCreateDialog = useCallback(
    () => setOpenCreateDialog(true),
    [],
  );
  const handleCloseCreateDialog = useCallback(
    () => setOpenCreateDialog(false),
    [],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNewStaff((prevStaff) => ({
        ...prevStaff,
        [name]: value,
      }));
    },
    [],
  );

  const handleCreateStaff = useCallback(async () => {
    try {
      await createStaff(newStaff, accessToken);
      toast.success("Staff created successfully!");
      handleCloseCreateDialog();
      refetch(); // Refetch the data after successful creation
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        "An error occurred during staff creation",
      );
      toast.error(errorMessage);
    }
  }, [newStaff, accessToken, handleCloseCreateDialog, refetch]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staffs Management</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Add New STAFF
        </Button>
      </div>

      <CreateStaffDialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        newStaff={newStaff}
        onInputChange={handleInputChange}
        onCreateStaff={handleCreateStaff}
      />

      <table className="whitespace-no-wrap w-full">
        <TableHeaderComponent headers={STAFF_MANAGEMENT_HEADER} />
        <tbody className="divide-y bg-white dark:divide-gray-700 dark:bg-gray-800">
          {staffs.map((staff) => (
            <tr key={staff.id} className="text-gray-700 dark:text-gray-400">
              <td className="px-4 py-3 text-sm">{staff.id}</td>
              <td className="px-4 py-3">
                <div className="flex items-center text-sm">
                  <div className="relative mr-3 hidden h-8 w-8 rounded-full md:block">
                    <img
                      className="h-full w-full rounded-full object-cover"
                      src={staff.avatar_url}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">{staff.first_name}</td>
              <td className="px-4 py-3 text-sm">{staff.last_name}</td>
              <td className="px-4 py-3 text-sm">
                {staff.phone_number || "Not provided"}
              </td>
              <td className="px-4 py-3 text-sm">{staff.email}</td>
              <td className="px-4 py-3 text-sm">{staff.address}</td>
              <td className="px-4 py-3 text-sm">{staff.status_name}</td>
              <td className="px-4 py-3 text-sm">{staff.is_active}</td>
              <td className="px-4 py-3 text-sm">{staff.is_subscription}</td>
              <td className="px-4 py-3 text-sm">{staff.date_of_birth}</td>
              <td className="px-4 py-3 text-sm">{staff.account_balance}</td>
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center space-x-4 text-sm">
                  <CrudButton
                    onClick={() => handleEdit(staff.id)}
                    ariaLabel="Edit"
                    svgPath="edit.svg"
                  />
                  <CrudButton
                    onClick={() => handleDelete(staff.id)}
                    ariaLabel="Delete"
                    svgPath="delete.svg"
                  />
                </div>
              </td>
            </tr>
          ))}
          {selectedStaffId && (
            <EditStaffDialog
              open={openEditDialog}
              onClose={handleCloseEditDialog}
              staffId={selectedStaffId}
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
      <ToastContainer />
    </div>
  );
};

export default StaffManagement;
