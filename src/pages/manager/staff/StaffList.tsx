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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "~/components/pagination/Pagination";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import { Staff, StaffRegisterDTO, StaffsResponse } from "~/types/users.type";
import { getCookie } from "~/utils/cookieUtils";
import CreateStaffDialog from "./CreateStaffDialog";
import EditStaffDialog from "./EditStaffDialog";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const StaffList = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
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
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 8; // Adjusted to match the API limit parameter
  const navigate = useNavigate();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

  const accessToken = getCookie("access_token");
  if (!accessToken) {
    navigate("/notfound");
    return;
  }

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await axios.get<StaffsResponse>(
          "http://localhost:4000/api/v1/staffs",
          {
            params: {
              page: page - 1,
              limit: itemsPerPage,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`, // Pass token in Authorization header
            },
          },
        );

        const data = response.data;

        if (data && Array.isArray(data.item)) {
          setStaffs(data.item);
          setTotalPages(data.total_page);
        } else {
          setError("Error fetching staffs");
        }
      } catch (err) {
        setError("Error fetching staffs");
      } finally {
        setLoading(false);
      }
    };

    fetchStaffs();
  }, [page, itemsPerPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleDelete = (id: number) => {
    const confirmed = confirm(`Are you sure you want to delete staff: ${id}?`);

    if (confirmed) {
      // Implement delete logic here if confirmed
      console.log(`Deleting staff with ID: ${id}`);
      //call this api , with header bearer token
      //{{API_PREFIX}}/staffs/21
      //delete staff with id 21
      axios
        .delete(`http://localhost:4000/api/v1/staffs/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            alert("Staff deleted successfully!");
            // Remove the deleted staff from the list
            // setStaffs(staffs.filter((staff) => staff.id !== id));
          }
        })
        .catch((error) => {
          console.error("Failed to delete staff:", error);
          alert("Failed to delete staff. Please try again.");
        });
    }
  };

  const handleEdit = (id: number) => {
    setSelectedStaffId(id);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedStaffId(null);
  };

  const handleOpenCreateDialog = () => setOpenCreateDialog(true);
  const handleCloseCreateDialog = () => setOpenCreateDialog(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStaff((prevStaff) => ({
      ...prevStaff,
      [name]: value,
    }));
  };

  const handleCreateStaff = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/staffs",
        newStaff,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // required Manager token
          },
        },
      );

      console.log("Data: ", newStaff);
      toast.success("Staff created successfully!");

      setStaffs([...staffs, response.data]);
      handleCloseCreateDialog();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.reason ||
          "An error occurred during create staff";
        toast.error(errorMessage);
      } else {
        toast.error("An error occurred during create staff");
      }

      setError("Error creating staff");
    }
  };

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
        <thead>
          <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <th className="px-4 py-3">Staff</th>
            <th className="px-4 py-3">First Name</th>
            <th className="px-4 py-3">Last Name</th>
            <th className="px-4 py-3">Phone Number</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Address</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Active</th>
            <th className="px-4 py-3">Subscription</th>
            <th className="px-4 py-3">Date of Birth</th>
            <th className="px-4 py-3">Balance</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-white dark:divide-gray-700 dark:bg-gray-800">
          {staffs.map((staff) => (
            <tr key={staff.id} className="text-gray-700 dark:text-gray-400">
              <td className="px-4 py-3">
                <div className="flex items-center text-sm">
                  <div className="relative mr-3 hidden h-8 w-8 rounded-full md:block">
                    <img
                      className="h-full w-full rounded-full object-cover"
                      src={staff.avatar_url}
                      alt=""
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0 rounded-full shadow-inner"
                      aria-hidden="true"
                    ></div>
                  </div>
                  <div>
                    <p className="font-semibold">{staff.first_name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Staff
                    </p>
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
                    svgPath="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  />
                  <CrudButton
                    onClick={() => handleDelete(staff.id)}
                    ariaLabel="Delete"
                    svgPath="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
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

export default StaffList;
