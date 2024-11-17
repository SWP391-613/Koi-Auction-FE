import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  InputLabel,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_URL_DEVELOPMENT } from "~/constants/endPoints";
import { UpdateUserDTO, UserResponse, UserStatus } from "~/types/users.type";
import { getCookie } from "~/utils/cookieUtils";

interface UserDetailDialogProps {
  openModal: boolean;
  handleClose: () => void;
}

interface ValidationErrors {
  [key: string]: string;
}

const UserDetailDialog: React.FC<UserDetailDialogProps> = ({
  openModal,
  handleClose,
}) => {
  const [fetchedUser, setFetchedUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
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

  // Validation rules
  const validateEmail = (email: string): string => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validatePhoneNumber = (phone: string): string => {
    // If phone is empty or only whitespace, it's valid (optional field)
    if (!phone || phone.trim() === "") return "";

    // Only validate if there's actually a phone number entered
    const phoneRegex = /^(?:\+84|0084|0)[235789][0-9]{1,2}[0-9]{7}$/;
    if (!phoneRegex.test(phone.trim())) {
      return "Invalid phone number format (must be in Vietnamese format +84xxxxxxxxx or 0xxxxxxxxx)";
    }
    return "";
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "email":
        return validateEmail(value);
      case "phone_number":
        return validatePhoneNumber(value);
      default:
        return "";
    }
  };

  useEffect(() => {
    if (openModal) {
      const userId = getCookie("user_id");
      const fetchUser = async () => {
        try {
          const response = await axios.get<UserResponse>(
            `${API_URL_DEVELOPMENT}/users/${userId}`,
          );
          setFetchedUser(response.data);

          // Map the UserResponse to UpdateUserDTO fields
          setUserFields({
            first_name: response.data.first_name || "",
            last_name: response.data.last_name || "",
            email: response.data.email || "",
            phone_number: response.data.phone_number || "",
            password: "",
            confirm_password: "",
            address: response.data.address || "",
            status: response.data.status_name,
            date_of_birth: response.data.date_of_birth || "",
            avatar_url: response.data.avatar_url || "",
            google_account_id: response.data.google_account_id || 0,
            balance_account: response.data.account_balance || 0,
          });

          // Reset validation state when modal opens
          setValidationErrors({});
          setTouchedFields(new Set());
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

    // Update form values
    setUserFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));

    // Mark field as touched
    setTouchedFields((prev) => new Set(prev).add(name));

    // Only validate if field has been touched
    if (touchedFields.has(name)) {
      const error = validateField(name, value);
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleSave = async () => {
    // Validate all fields before saving
    const errors: ValidationErrors = {};
    Object.entries(userFields).forEach(([name, value]) => {
      if (typeof value === "string") {
        const error = validateField(name, value);
        if (error) errors[name] = error;
      }
    });

    // If there are validation errors, show them and prevent saving
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setTouchedFields(new Set(Object.keys(errors)));
      toast.error("Please fix the validation errors before saving");
      return;
    }

    try {
      const userId = getCookie("user_id");
      const accessToken = getCookie("access_token");

      const updatedFields = {
        ...userFields,
        phone_number: userFields.phone_number.trim(),
      };

      await axios.put(
        `${API_URL_DEVELOPMENT}/users/details/${userId}`,
        updatedFields,
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

  const getFieldError = (fieldName: string): string => {
    return touchedFields.has(fieldName)
      ? validationErrors[fieldName] || ""
      : "";
  };

  return (
    <Dialog open={openModal} onClose={handleClose}>
      <DialogTitle className="text-center">
        {loading
          ? "Loading..."
          : `Update for ${fetchedUser?.role_name} ${fetchedUser?.first_name} ${fetchedUser?.last_name}`}
      </DialogTitle>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[600px]">
        {!loading && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-6 items-center gap-4">
              <InputLabel htmlFor="first_name" className="text-right">
                First Name
              </InputLabel>
              <TextField
                id="first_name"
                name="first_name"
                value={userFields.first_name}
                onChange={handleFieldChange}
                className="col-span-5"
              />
            </div>

            <div className="grid grid-cols-6 items-center gap-4">
              <InputLabel htmlFor="last_name" className="text-right">
                Last Name
              </InputLabel>
              <TextField
                id="last_name"
                name="last_name"
                value={userFields.last_name}
                onChange={handleFieldChange}
                className="col-span-5"
              />
            </div>

            <div className="grid grid-cols-6 items-center gap-4">
              <InputLabel htmlFor="email" className="text-right">
                Email
              </InputLabel>
              <TextField
                id="email"
                name="email"
                type="email"
                value={userFields.email}
                onChange={handleFieldChange}
                error={!!getFieldError("email")}
                helperText={getFieldError("email")}
                className="col-span-5"
              />
            </div>

            <div className="grid grid-cols-6 items-center gap-4">
              <InputLabel htmlFor="phone_number" className="text-right">
                Phone
              </InputLabel>
              <TextField
                id="phone_number"
                name="phone_number"
                value={userFields.phone_number}
                onChange={handleFieldChange}
                error={!!getFieldError("phone_number")}
                helperText={getFieldError("phone_number")}
                className="col-span-5"
                placeholder="Enter phone number (optional)"
              />
            </div>

            <div className="grid grid-cols-6 items-center gap-4">
              <InputLabel htmlFor="address" className="text-right">
                Address
              </InputLabel>
              <TextField
                id="address"
                name="address"
                value={userFields.address}
                onChange={handleFieldChange}
                className="col-span-5"
              />
            </div>

            <div className="grid grid-cols-6 items-center gap-4">
              <InputLabel htmlFor="date_of_birth" className="text-right">
                Birth Date
              </InputLabel>
              <TextField
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={userFields.date_of_birth}
                onChange={handleFieldChange}
                className="col-span-5"
              />
            </div>

            <div className="grid grid-cols-6 items-center gap-4">
              <InputLabel htmlFor="avatar_url" className="text-right">
                Avatar URL
              </InputLabel>
              <TextField
                id="avatar_url"
                name="avatar_url"
                value={userFields.avatar_url}
                onChange={handleFieldChange}
                className="col-span-5"
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
