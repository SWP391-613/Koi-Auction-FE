import AddIcon from "@mui/icons-material/Add";
import { Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { undoDeleteUser } from "~/apis/user.apis";
import { deleteStaff } from "~/apis/users/staff.apis";
import PaginationComponent from "~/components/common/PaginationComponent";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import TableHeaderComponent from "~/components/shared/TableHeaderComponent";
import { DYNAMIC_API_URL } from "~/constants/endPoints";
import {
  CONFIRMATION_MESSAGE,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
} from "~/constants/message";
import { STAFF_MANAGEMENT_HEADER } from "~/constants/tableHeader";
import usePagination from "~/hooks/usePagination";
import { Staff, StaffRegisterDTO } from "~/types/users.type";
import { getCookie } from "~/utils/cookieUtils";
import { extractErrorMessage } from "~/utils/dataConverter";
import AddStaffDialog from "./AddStaffDialog";
import EditStaffDialog from "./EditStaffDialog";
import CustomButton from "~/components/shared/CustomButton";

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
    totalItems,
    handlePageChange,
    refetch,
  } = usePagination<Staff>({
    apiUrl: `${DYNAMIC_API_URL}/staffs`,
    itemsPerPage: 20,
    accessToken,
  });

  if (!accessToken) return null;

  const handleDelete = useCallback(
    async (id: number) => {
      const confirmed = window.confirm(
        `${CONFIRMATION_MESSAGE.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_STAFF}?`,
      );
      if (!confirmed) return;

      try {
        await deleteStaff(id, accessToken); // Use the utility function for API call
        toast.success(SUCCESS_MESSAGE.DELETE_STAFF_SUCCESS);
        refetch(); // Refetch the data after successful deletion
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          ERROR_MESSAGE.DELETE_STAFF_FAILED,
        );
        toast.error(errorMessage);
      }
    },
    [accessToken, refetch],
  );

  const handleUndoDelete = async (id: number) => {
    const confirmReject = confirm(
      `${CONFIRMATION_MESSAGE.ARE_YOU_SURE_YOU_WANT_TO_REDO_THIS_STAFF} ${id}`,
    );
    if (!confirmReject) return;

    try {
      await undoDeleteUser(id);
      toast.success(SUCCESS_MESSAGE.REDO_STAFF_SUCCESS);
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        ERROR_MESSAGE.REDO_STAFF_FAILED,
      );
      toast.error(errorMessage);
    }
  };

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

  const handleInputChange = (name: string, value: unknown) => {};

  return (
    <div className="m-5 overflow-x-auto">
      <div className="mb-6 flex justify-between">
        <div className="border-2 border-sky-500 p-6 rounded-xl">
          <Typography variant="h5">Total Staff: {totalItems}</Typography>
        </div>
        <CustomButton onClick={handleOpenCreateDialog}>
      <AddIcon className="mr-2" />
      New Staff
    </CustomButton>
      </div>

      <AddStaffDialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        onInputChange={handleInputChange}
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
              <td className="px-4 py-3 text-sm">
                {staff.first_name} {staff.last_name}
              </td>
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
              <td className="px-4 py-3 text-sm">{staff.auction_count}</td>
              <td className="px-4 py-3 text-sm">{staff.created_at}</td>
              <td className="px-4 py-3 text-sm">{staff.updated_at}</td>
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center space-x-4 text-sm">
                  <CrudButton
                    onClick={() => handleDelete(staff.id)}
                    ariaLabel="Delete"
                    svgPath="delete.svg"
                  />
                  <CrudButton
                    onClick={() => handleUndoDelete(staff.id)}
                    ariaLabel="Redo breeder"
                    svgPath="redo.svg"
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
