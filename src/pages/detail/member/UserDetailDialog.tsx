import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "~/utils/cookieUtils";
import { UserResponse, UpdateUserDTO, UserStatus } from "~/types/users.type";
import {
  Dialog,
  DialogContent,
  TextField,
  DialogTitle,
  Button,
  InputLabel,
} from "@mui/material";
import { toast } from "react-toastify";

interface UserDetailDialogProps {
  openModal: boolean;
  handleClose: () => void;
}

const UserDetailDialog: React.FC<UserDetailDialogProps> = ({
  openModal,
  handleClose,
}) => {
  const [fetchedUser, setFetchedUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [userFields, setUserFields] = useState<UpdateUserDTO>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    status: "" as UserStatus,
    date_of_birth: "",
    avatar_url: "",
    google_account_id: 0,
    balance_account: 0,
  });

  useEffect(() => {
    if (openModal) {
      const userId = getCookie("user_id");
      const fetchUser = async () => {
        try {
          const response = await axios.get<UserResponse>(
            `https://koi-auction-be-az-dtarcyafdhc2gcen.southeastasia-01.azurewebsites.net/api/v1/users/${userId}`,
          );
          setFetchedUser(response.data);

          // Map the UserResponse to UpdateUserDTO fields
          setUserFields({
            first_name: response.data.first_name || "",
            last_name: response.data.last_name || "",
            email: response.data.email || "",
            phone_number: response.data.phone_number || "",
            password: "", // Empty as we don't want to show/update password by default
            confirm_password: "", // Empty as we don't want to show/update password by default
            address: response.data.address || "",
            status: response.data.status_name,
            date_of_birth: response.data.date_of_birth || "",
            avatar_url: response.data.avatar_url || "",
            google_account_id: response.data.google_account_id || 0,
            balance_account: response.data.account_balance || 0,
          });
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [openModal]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const userId = getCookie("user_id");
      const accessToken = getCookie("access_token");

      await axios.put(
        `https://koi-auction-be-az-dtarcyafdhc2gcen.southeastasia-01.azurewebsites.net/api/v1/users/${userId}`,
        userFields,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      toast.success("User details updated successfully");
      handleClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.reason || "An error occurred");
      }
    }
  };

  return (
    <Dialog open={openModal} onClose={handleClose}>
      <DialogTitle>
        {loading
          ? "Loading..."
          : `Edit User Details for ${fetchedUser?.first_name} ${fetchedUser?.last_name}`}
      </DialogTitle>
      <DialogContent className="sm:max-w-[425px]">
        {!loading && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <InputLabel htmlFor="first_name" className="text-right">
                First Name
              </InputLabel>
              <TextField
                id="first_name"
                name="first_name"
                value={userFields.first_name}
                onChange={handleFieldChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <InputLabel htmlFor="last_name" className="text-right">
                Last Name
              </InputLabel>
              <TextField
                id="last_name"
                name="last_name"
                value={userFields.last_name}
                onChange={handleFieldChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <InputLabel htmlFor="email" className="text-right">
                Email
              </InputLabel>
              <TextField
                id="email"
                name="email"
                type="email"
                value={userFields.email}
                onChange={handleFieldChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <InputLabel htmlFor="phone_number" className="text-right">
                Phone
              </InputLabel>
              <TextField
                id="phone_number"
                name="phone_number"
                value={userFields.phone_number}
                onChange={handleFieldChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <InputLabel htmlFor="address" className="text-right">
                Address
              </InputLabel>
              <TextField
                id="address"
                name="address"
                value={userFields.address}
                onChange={handleFieldChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <InputLabel htmlFor="date_of_birth" className="text-right">
                Birth Date
              </InputLabel>
              <TextField
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={userFields.date_of_birth}
                onChange={handleFieldChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <InputLabel htmlFor="avatar_url" className="text-right">
                Avatar URL
              </InputLabel>
              <TextField
                id="avatar_url"
                name="avatar_url"
                value={userFields.avatar_url}
                onChange={handleFieldChange}
                className="col-span-3"
              />
            </div>

            <Button
              variant="contained"
              onClick={handleSave}
              className="w-full mt-4"
            >
              Save Changes
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;
